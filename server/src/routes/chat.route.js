import express from "express";
import {
    startNewChatController,
    continueChatController,
    listChatsController,
    getChatController,
    uploadToChatController,
} from "../controllers/chat.controller.js";
import { validateNewChatMessage } from "../middleware/chatMiddleware.js";
import { chatRateLimiter, uploadRateLimiter } from "../middleware/rateLimiter.js";
import { upload } from "../config/upload.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", listChatsController);
router.get("/:chatId", getChatController);
router.post("/new", chatRateLimiter, validateNewChatMessage, startNewChatController);
router.post("/:chatId/message", chatRateLimiter, validateNewChatMessage, continueChatController);
router.post("/:chatId/upload", uploadRateLimiter, upload.single("file"), uploadToChatController);

export default router;