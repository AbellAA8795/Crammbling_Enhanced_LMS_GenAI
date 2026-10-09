// server/src/services/Chatbot_services/summarization.service.js
//
// Memory & context management. When a chat's message history grows
// past SUMMARY_TRIGGER_COUNT, the older messages get folded into a
// running summary stored on chats.summary, and only the most recent
// SUMMARY_KEEP_RECENT_COUNT messages + that summary are sent to the
// model going forward. This keeps context length (and therefore cost
// and latency) bounded no matter how long a conversation gets.
//
// ISO 25010: Performance efficiency (bounded context size regardless
// of conversation length) and Reliability (summarization failure
// degrades gracefully — falls back to full recent history rather than
// throwing and breaking the chat).

import pool from "../../config/database.js";
import { getOllamaReply, pickModel } from "./ollama.service.js";

const SUMMARY_TRIGGER_COUNT = parseInt(process.env.SUMMARY_TRIGGER_MESSAGE_COUNT || "20", 10);
const SUMMARY_KEEP_RECENT_COUNT = parseInt(process.env.SUMMARY_KEEP_RECENT_COUNT || "10", 10);

/**
 * Checks whether a chat's history needs summarizing, and if so,
 * summarizes everything except the most recent SUMMARY_KEEP_RECENT_COUNT
 * messages, storing the result on chats.summary.
 *
 * Never throws — a summarization failure just means the chat continues
 * without a fresher summary (older one, if any, is still used), rather
 * than blocking the user's actual message from going through.
 */
export async function summarizeIfNeeded(chatId) {
  try {
    const { rows } = await pool.query(
      `SELECT message_id, role, content FROM chatbot.chat_messages
       WHERE chat_id = $1 ORDER BY message_id ASC`,
      [chatId]
    );

    if (rows.length <= SUMMARY_TRIGGER_COUNT) return;

    const toSummarize = rows.slice(0, rows.length - SUMMARY_KEEP_RECENT_COUNT);
    if (toSummarize.length === 0) return;

    const { rows: chatRows } = await pool.query(
      `SELECT summary FROM chatbot.chats WHERE chat_id = $1`,
      [chatId]
    );
    const existingSummary = chatRows[0]?.summary || "";

    const transcript = toSummarize.map((m) => `${m.role}: ${m.content}`).join("\n");
    const prompt = [
      {
        role: "system",
        content:
          "You compress conversation history into a short factual summary for another AI to use as context. " +
          "Preserve names, decisions, and open questions. Do not add commentary. Keep it under 150 words.",
      },
      {
        role: "user",
        content: existingSummary
          ? `Existing summary:\n${existingSummary}\n\nNew messages to fold in:\n${transcript}\n\nProduce one updated summary.`
          : `Messages to summarize:\n${transcript}`,
      },
    ];

    const model = pickModel(transcript, 0); // summarization itself can use the lightweight model
    const { fullText } = await getOllamaReply(prompt, { model });

    const lastSummarizedId = toSummarize[toSummarize.length - 1].message_id;

    await pool.query(
      `CALL chatbot.update_chat_summary_procedure($1, $2, $3)`,
      [chatId, fullText.trim(), lastSummarizedId]
    );
  } catch (err) {
    // Degrade gracefully: log and move on. A missing/stale summary is
    // recoverable; blocking the user's message is not.
    console.error(`[summarization] chat ${chatId} failed:`, err.message);
  }
}

/**
 * Returns the context to actually send to the model: the stored
 * summary (if any) plus only the most recent N messages, instead of
 * the full history.
 */
export async function getBoundedContext(chatId) {
  const { rows: chatRows } = await pool.query(
    `SELECT summary FROM chatbot.chats WHERE chat_id = $1`,
    [chatId]
  );
  const summary = chatRows[0]?.summary || null;

  const { rows: recent } = await pool.query(
    `SELECT role, content FROM chatbot.chat_messages
     WHERE chat_id = $1 ORDER BY message_id DESC LIMIT $2`,
    [chatId, SUMMARY_KEEP_RECENT_COUNT]
  );
  recent.reverse(); // chronological order

  return { summary, recentHistory: recent };
}
