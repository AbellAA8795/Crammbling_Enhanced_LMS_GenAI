// prompt.route.js

import express from "express";
import {
    getActivePromptController,
    createPromptVersionController,
    activatePromptVersionController,
} from "../../controllers/Chatbot_services/prompt.controller.js";
import verifyToken from "../../middleware/shared/verifyToken.js";
import { requireRole } from "../../middleware/shared/requireRole.js";

const router = express.Router();

router.use(verifyToken);

// Any logged-in user can see which prompt is currently active (read-only,
// no sensitive content exposed beyond what the chatbot already uses).
router.get("/active", getActivePromptController);

// Creating/activating a system prompt changes model behavior for every
// user — IT (super_admin) only.
router.post("/", requireRole("super_admin"), createPromptVersionController);
router.post("/activate", requireRole("super_admin"), activatePromptVersionController);

export default router;