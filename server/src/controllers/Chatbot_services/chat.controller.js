import {
  createChat,
  insertMessage,
  getUserChats,
  getChatMessages,
  chatBelongsToUser,
} from "../../models/Chatbot_services/chat.model.js";
import { streamOllamaReply } from "../../services/Chatbot_services/ollama.service.js";
import { getActivePrompt } from "../../models/Chatbot_services/prompt.model.js";
import { ollamaQueue, getQueuePosition } from "../../services/Chatbot_services/queue.service.js";
import { MAX_HISTORY_MESSAGES } from "../../middleware/Chatbot_services/chatMiddleware.js";
import fs from "fs/promises";

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

export async function startNewChatController(req, res) {
    try {
        const userId = req.user.id;
        const { message } = req.body;

        const title = generateTitleFromMessage(message);
        const chatId = await createChat(userId, title);
        await insertMessage(chatId, "user", message);

        const activePrompt = await getActivePrompt();

        startSSE(res);
        sendSSE(res, { type: "start", chatId, title });

        const position = getQueuePosition();
        if (position > 0) {
            sendSSE(res, { type: "queued", position });
        }

        let fullReply = "";
        try {
            fullReply = await ollamaQueue.add(() =>
                streamOllamaReply(
                    [{ role: "user", content: message }],
                    activePrompt?.content,
                    (chunk) => sendSSE(res, { type: "chunk", content: chunk })
                )
            );
        } catch (ollamaError) {
            console.error("Ollama streaming error:", ollamaError);
            sendSSE(res, { type: "error", message: "The assistant is currently unavailable." });
            return res.end();
        }

        await insertMessage(chatId, "assistant", fullReply, activePrompt?.version);

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

        let history = await getChatMessages(chatId, userId);
        if (history.length > MAX_HISTORY_MESSAGES) {
            history = history.slice(-MAX_HISTORY_MESSAGES);
        }

        const activePrompt = await getActivePrompt();

        startSSE(res);
        sendSSE(res, { type: "start" });

        const position = getQueuePosition();
        if (position > 0) {
            sendSSE(res, { type: "queued", position });
        }

        let fullReply = "";
        try {
            fullReply = await ollamaQueue.add(() =>
                streamOllamaReply(
                    history,
                    activePrompt?.content,
                    (chunk) => sendSSE(res, { type: "chunk", content: chunk })
                )
            );
        } catch (ollamaError) {
            console.error("Ollama streaming error:", ollamaError);
            sendSSE(res, { type: "error", message: "The assistant is currently unavailable." });
            return res.end();
        }

        await insertMessage(chatId, "assistant", fullReply, activePrompt?.version);

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

    let history = await getChatMessages(chatId, userId);
    if (history.length > MAX_HISTORY_MESSAGES) {
      history = history.slice(-MAX_HISTORY_MESSAGES);
    }

    const botReply = await getOllamaReply(history);
    await insertMessage(chatId, "assistant", botReply);

    return res.status(200).json({
      success: true,
      data: {
        fileName: req.file.originalname,
        reply: botReply,
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
