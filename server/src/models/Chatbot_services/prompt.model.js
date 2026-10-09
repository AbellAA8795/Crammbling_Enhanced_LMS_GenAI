import pool from "../../config/database.js";

export async function getActivePrompt() {
    const result = await pool.query(`SELECT * FROM chatbot.get_active_prompt_function()`);
    return result.rows[0] || null;
}

// Extended with the two new optional params from the v4 migration.
// fewShotExamples should be an array of {role, content} objects (or
// omitted/[] for none) — it's stored as JSONB, so stringify it here.
export async function createPromptVersion(version, content, activate, fewShotExamples = [], responseGuidelines = null) {
    const query = `CALL chatbot.create_prompt_version_procedure($1, $2, $3, $4, $5)`;
    await pool.query(query, [version, content, activate, JSON.stringify(fewShotExamples), responseGuidelines]);
}

export async function activatePromptVersion(version) {
    const query = `CALL chatbot.activate_prompt_version_procedure($1)`;
    await pool.query(query, [version]);
}