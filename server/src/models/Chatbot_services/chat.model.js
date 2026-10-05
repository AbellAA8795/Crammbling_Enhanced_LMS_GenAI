import pool from "../../config/database.js";

export async function createChat(userId, title) {
    const query = `CALL chatbot.create_chat_procedure($1, $2, NULL)`;
    const result = await pool.query(query, [userId, title]);
    return result.rows[0].o_chat_id;
}

export async function getUserChats(userId) {
    const query = `SELECT * FROM chatbot.get_user_chats_function($1)`;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

export async function getChatMessages(chatId, userId) {
    const query = `SELECT * FROM chatbot.get_chat_messages_function($1, $2)`;
    const result = await pool.query(query, [chatId, userId]);
    return result.rows;
}

export async function chatBelongsToUser(chatId, userId) {
    const query = `SELECT chatbot.chat_belongs_to_user_function($1, $2) AS belongs`;
    const result = await pool.query(query, [chatId, userId]);
    return result.rows[0].belongs;
}

// Extended with the optional token/latency/model columns added in the
// v4 migration. Existing call sites that only pass (chatId, role,
// content) or (chatId, role, content, promptVersion) still work
// unchanged — the new params default to null.
export async function insertMessage(
    chatId,
    role,
    content,
    promptVersion = null,
    promptTokens = null,
    completionTokens = null,
    latencyMs = null,
    modelUsed = null
) {
    const query = `CALL chatbot.insert_chat_message_procedure($1, $2, $3, $4, $5, $6, $7, $8)`;
    await pool.query(query, [
        chatId, role, content, promptVersion,
        promptTokens, completionTokens, latencyMs, modelUsed,
    ]);
}