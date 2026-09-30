import pool from "../../config/database.js";

export async function getActivePrompt() {
    const result = await pool.query(`SELECT * FROM get_active_prompt_function()`);
    return result.rows[0] || null;
}

export async function createPromptVersion(version, content, activate) {
    const query = `CALL create_prompt_version_procedure($1, $2, $3)`;
    await pool.query(query, [version, content, activate]);
}

export async function activatePromptVersion(version) {
    const query = `CALL activate_prompt_version_procedure($1)`;
    await pool.query(query, [version]);
}