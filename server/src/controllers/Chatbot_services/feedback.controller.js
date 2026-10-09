// server/src/controllers/Chatbot_services/feedback.controller.js
import {
  submitFeedback,
  getFeedbackStats,
  getFlaggedMessages,
  getUsageStats,
} from "../../models/Chatbot_services/feedback.model.js";

// POST /api/chat/messages/:messageId/feedback
// body: { rating: 1 | -1, comment?: string }
export async function submitFeedbackController(req, res) {
  try {
    const { messageId } = req.params;
    const { rating, comment } = req.body;

    if (![1, -1].includes(rating)) {
      return res.status(400).json({ error: "rating must be 1 or -1" });
    }
    if (comment && comment.length > 1000) {
      return res.status(400).json({ error: "comment must be 1000 characters or fewer" });
    }

    await submitFeedback(Number(messageId), req.user.id, rating, comment);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("[feedback] submit failed:", err.message);
    res.status(500).json({ error: "Failed to record feedback" });
  }
}

// GET /api/admin/chatbot/feedback-stats (admin/super_admin only)
export async function getFeedbackStatsController(req, res) {
  try {
    const stats = await getFeedbackStats(req.query.since);
    res.status(200).json(stats);
  } catch (err) {
    console.error("[feedback] stats failed:", err.message);
    res.status(500).json({ error: "Failed to load feedback stats" });
  }
}

// GET /api/admin/chatbot/flagged-messages (admin/super_admin only)
export async function getFlaggedMessagesController(req, res) {
  try {
    const rows = await getFlaggedMessages(req.query.since);
    res.status(200).json(rows);
  } catch (err) {
    console.error("[feedback] flagged messages failed:", err.message);
    res.status(500).json({ error: "Failed to load flagged messages" });
  }
}

// GET /api/admin/chatbot/usage-stats (admin/super_admin only)
export async function getUsageStatsController(req, res) {
  try {
    const rows = await getUsageStats(req.query.since);
    res.status(200).json(rows);
  } catch (err) {
    console.error("[feedback] usage stats failed:", err.message);
    res.status(500).json({ error: "Failed to load usage stats" });
  }
}
