// server/src/routes/Chatbot_services/feedback.route.js
import express from "express";
import verifyToken from "../../middleware/shared/verifyToken.js";
import { requireRole } from "../../middleware/shared/requireRole.js"; // from the earlier role proposal; swap for requireAdmin if you haven't added requireRole yet
import {
  submitFeedbackController,
  getFeedbackStatsController,
  getFlaggedMessagesController,
  getUsageStatsController,
} from "../../controllers/Chatbot_services/feedback.controller.js";

const router = express.Router();

router.post("/messages/:messageId/feedback", verifyToken, submitFeedbackController);

// Admin/IT-only visibility into quality + cost
router.get("/admin/feedback-stats", verifyToken, requireRole("teacher", "super_admin"), getFeedbackStatsController);
router.get("/admin/flagged-messages", verifyToken, requireRole("teacher", "super_admin"), getFlaggedMessagesController);
router.get("/admin/usage-stats", verifyToken, requireRole("super_admin"), getUsageStatsController);

export default router;
