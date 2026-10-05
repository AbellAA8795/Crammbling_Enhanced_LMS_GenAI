// server/src/models/Chatbot_services/feedback.model.js
import { pool } from "../../config/database.js";

export async function submitFeedback(messageId, userId, rating, comment) {
  await pool.query(
    `CALL chatbot.submit_feedback_procedure($1, $2, $3, $4)`,
    [messageId, userId, rating, comment || null]
  );
}

export async function getFeedbackStats(sinceDate) {
  const { rows } = await pool.query(
    `SELECT * FROM chatbot.get_feedback_stats_function($1)`,
    [sinceDate || null]
  );
  return rows[0];
}

export async function getFlaggedMessages(sinceDate) {
  const { rows } = await pool.query(
    `SELECT * FROM chatbot.get_flagged_messages_function($1)`,
    [sinceDate || null]
  );
  return rows;
}

export async function getUsageStats(sinceDate) {
  const { rows } = await pool.query(
    `SELECT * FROM chatbot.get_usage_stats_function($1)`,
    [sinceDate || null]
  );
  return rows;
}
