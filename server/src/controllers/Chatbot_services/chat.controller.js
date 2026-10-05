import {
  createChat,
  insertMessage,
  getUserChats,
  getChatMessages,
  chatBelongsToUser,
} from "../../models/Chatbot_services/chat.model.js";
import {
  streamOllamaReply,
  getOllamaReply,
  buildMessages,
  pickModel,
  getCachedActivePrompt,
  invalidatePromptCache,
  OllamaTimeoutError,
  OllamaUnavailableError,
  OllamaResponseError,
} from "../../services/Chatbot_services/ollama.service.js";
import { summarizeIfNeeded, getBoundedContext } from "../../services/Chatbot_services/summarization.service.js";
import { getActivePrompt } from "../../models/Chatbot_services/prompt.model.js";
import { ollamaQueue, getQueuePosition } from "../../services/Chatbot_services/queue.service.js";
import fs from "fs/promises";

// Re-exported so prompt.controller.js can invalidate the cache after
// creating/activating a prompt version without importing ollama.service directly.
export { invalidatePromptCache };

// Helper: turn the first message into a short title
function generateTitleFromMessage(message) {
    const trimmed = message.trim();
    return trimmed.length > 60 ? trimmed.slice(0, 60) + "..." : trimmed;
}

function startSSE(res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
}

function sendSSE(res, data) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// Maps a thrown error to a client-safe message + log line. Keeps the
// "what do we tell the user" decision in one place instead of repeated
// per controller (ISO 25010 — Security: no stack traces/internal detail
// reach the client; Reliability: every failure path is classified).
function describeError(err) {
    if (err instanceof OllamaTimeoutError) {
        return { log: "timeout", client: "The assistant took too long to respond. Please try again." };
    }
    if (err instanceof OllamaUnavailableError) {
        return { log: "unavailable", client: "The assistant is temporarily unavailable. Please try again shortly." };
    }
    if (err instanceof OllamaResponseError) {
        return { log: "bad response", client: "The assistant had trouble responding. Please try again." };
    }
    return { log: "unknown", client: "Something went wrong generating a response." };
}

export async function startNewChatController(req, res) {
    try {
        const userId = req.user.id;
        const { message } = req.body;

        const title = generateTitleFromMessage(message);
        const chatId = await createChat(userId, title);
        await insertMessage(chatId, "user", message);

        const systemPrompt = await getCachedActivePrompt(() => getActivePrompt());

        startSSE(res);
        sendSSE(res, { type: "start", chatId, title });

        const position = getQueuePosition();
        if (position > 0) {
            sendSSE(res, { type: "queued", position });
        }

        const messages = buildMessages({
            systemPrompt,
            conversationSummary: null,
            recentHistory: [],
            userMessage: message,
        });
        const model = pickModel(message, 0);

        let result;
        try {
            result = await ollamaQueue.add(() =>
                streamOllamaReply(messages, {
                    model,
                    onChunk: (chunk) => sendSSE(res, { type: "chunk", content: chunk }),
                })
            );
        } catch (ollamaError) {
            const { log, client } = describeError(ollamaError);
            console.error(`[chat:new] ${log}:`, ollamaError.message);
            sendSSE(res, { type: "error", message: client });
            return res.end();
        }

        await insertMessage(
            chatId, "assistant", result.fullText, systemPrompt?.version,
            result.promptTokens, result.completionTokens, result.latencyMs, result.model
        );

        sendSSE(res, { type: "done" });
        res.end();

    } catch (error) {
        console.error("Error starting new chat:", error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Failed to start chat." });
        }
        res.end();
    }
}

export async function continueChatController(req, res) {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;
        const { message } = req.body;

        const belongs = await chatBelongsToUser(chatId, userId);
        if (!belongs) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }

        await insertMessage(chatId, "user", message);

        // Keeps context bounded regardless of how long the conversation
        // has grown (memory management) — summarizes older turns if needed,
        // then returns only the stored summary + the most recent messages.
        await summarizeIfNeeded(chatId);
        const { summary, recentHistory } = await getBoundedContext(chatId);

        const systemPrompt = await getCachedActivePrompt(() => getActivePrompt());

        startSSE(res);
        sendSSE(res, { type: "start" });

        const position = getQueuePosition();
        if (position > 0) {
            sendSSE(res, { type: "queued", position });
        }

        const messages = buildMessages({
            systemPrompt,
            conversationSummary: summary,
            recentHistory,
            userMessage: message,
        });
        const model = pickModel(message, recentHistory.length);

        let result;
        try {
            result = await ollamaQueue.add(() =>
                streamOllamaReply(messages, {
                    model,
                    onChunk: (chunk) => sendSSE(res, { type: "chunk", content: chunk }),
                })
            );
        } catch (ollamaError) {
            const { log, client } = describeError(ollamaError);
            console.error(`[chat:${chatId}] ${log}:`, ollamaError.message);
            sendSSE(res, { type: "error", message: client });
            return res.end();
        }

        await insertMessage(
            chatId, "assistant", result.fullText, systemPrompt?.version,
            result.promptTokens, result.completionTokens, result.latencyMs, result.model
        );

        sendSSE(res, { type: "done" });
        res.end();

    } catch (error) {
        console.error("Error continuing chat:", error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Failed to send message." });
        }
        res.end();
    }
}

export async function listChatsController(req, res) {
    try {
        const userId = req.user.id;
        const chats = await getUserChats(userId);
        return res.status(200).json({ success: true, data: chats });
    } catch (error) {
        console.error("Error listing chats:", error);
        return res.status(500).json({ success: false, message: "Failed to load chat history." });
    }
}

export async function getChatController(req, res) {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;

        const belongs = await chatBelongsToUser(chatId, userId);
        if (!belongs) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }

        const messages = await getChatMessages(chatId, userId);
        return res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Error fetching chat:", error);
        return res.status(500).json({ success: false, message: "Failed to load chat." });
    }
}

export async function uploadToChatController(req, res) {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { message } = req.body;

    const belongs = await chatBelongsToUser(chatId, userId);
    if (!belongs) {
      // clean up the uploaded file if the chat isn't theirs
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const fileNote = `[User uploaded a file: ${req.file.originalname}]`;
    const combinedMessage = message ? `${message}\n\n${fileNote}` : fileNote;

    await insertMessage(chatId, "user", combinedMessage);

    await summarizeIfNeeded(chatId);
    const { summary, recentHistory } = await getBoundedContext(chatId);
    const systemPrompt = await getCachedActivePrompt(() => getActivePrompt());

    const messages = buildMessages({
      systemPrompt,
      conversationSummary: summary,
      recentHistory,
      userMessage: fileNote,
    });
    const model = pickModel(combinedMessage, recentHistory.length);

    let result;
    try {
      result = await ollamaQueue.add(() => getOllamaReply(messages, { model }));
    } catch (ollamaError) {
      const { log, client } = describeError(ollamaError);
      console.error(`[chat:upload:${chatId}] ${log}:`, ollamaError.message);
      return res.status(ollamaError.statusCode || 500).json({ success: false, message: client });
    }

    await insertMessage(
      chatId, "assistant", result.fullText, systemPrompt?.version,
      result.promptTokens, result.completionTokens, result.latencyMs, result.model
    );

    return res.status(200).json({
      success: true,
      data: {
        fileName: req.file.originalname,
        reply: result.fullText,
      },
    });
  } catch (error) {
    console.error("Error uploading file to chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload file.",
    });
  }
}
