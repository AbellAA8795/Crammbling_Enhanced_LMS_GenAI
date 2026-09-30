import express from "express";
import {
    getActivePromptController,
    createPromptVersionController,
    activatePromptVersionController,
} from "../../controllers/Chatbot_services/prompt.controller.js";
import verifyToken from "../../middleware/shared/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // ideally also restrict to admin-only users later

router.get("/active", getActivePromptController);
router.post("/", createPromptVersionController);
router.post("/activate", activatePromptVersionController);

export default router;