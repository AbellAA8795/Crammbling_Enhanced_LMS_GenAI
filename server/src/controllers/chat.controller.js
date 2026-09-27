import {
  createChat,
  insertMessage,
  getUserChats,
  getChatMessages,
  chatBelongsToUser,
} from "../models/chat.model.js";
import { getOllamaReply } from "../services/ollama.service.js";
import { MAX_HISTORY_MESSAGES } from "../middleware/chatMiddleware.js";
import fs from "fs/promises";

// Helper: turn the first message into a short title
function generateTitleFromMessage(message) {
  const trimmed = message.trim();
  return trimmed.length > 60 ? trimmed.slice(0, 60) + "..." : trimmed;
}

// POST /api/chat/new — starts a brand new conversation
export async function startNewChatController(req, res) {
  try {
    const userId = req.user.id; // comes from your verifyToken middleware
    const { message } = req.body;

    const title = generateTitleFromMessage(message);
    const chatId = await createChat(userId, title);

    await insertMessage(chatId, "user", message);

    const botReply = await getOllamaReply([{ role: "user", content: message }]);

    await insertMessage(chatId, "assistant", botReply);

    return res.status(201).json({
      success: true,
      message: "Chat started successfully.",
      data: {
        chatId,
        title,
        reply: botReply,
      },
    });
  } catch (error) {
    console.error("Error starting new chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start chat.",
    });
  }
}

// POST /api/chat/:chatId/message — continues an existing conversation
export async function continueChatController(req, res) {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { message } = req.body;

    const belongs = await chatBelongsToUser(chatId, userId);
    if (!belongs) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    await insertMessage(chatId, "user", message);

    // Pull full history so Ollama has context of the whole conversation
    let history = await getChatMessages(chatId, userId);
    if (history.length > MAX_HISTORY_MESSAGES) {
      history = history.slice(-MAX_HISTORY_MESSAGES); // keep only the most recent N messages
    }

    const botReply = await getOllamaReply(history);

    await insertMessage(chatId, "assistant", botReply);

    return res.status(200).json({
      success: true,
      data: { reply: botReply },
    });
  } catch (error) {
    console.error("Error continuing chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
}

// GET /api/chat — list all of the user's chats (for a sidebar/history)
export async function listChatsController(req, res) {
  try {
    const userId = req.user.id;
    const chats = await getUserChats(userId);

    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    console.error("Error listing chats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chat history.",
    });
  }
}

// GET /api/chat/:chatId — get full message history of one chat (to revisit/continue it)
export async function getChatController(req, res) {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const belongs = await chatBelongsToUser(chatId, userId);
    if (!belongs) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    const messages = await getChatMessages(chatId, userId);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chat.",
    });
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
                message: "Chat not found."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
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
                reply: botReply
            }
        });

    } catch (error) {
        console.error("Error uploading file to chat:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload file."
        });
    }
}