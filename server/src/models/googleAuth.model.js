import pool from "../config/database.js";

export async function findOrCreateGoogleUser(googleId, email, name, avatarUrl) {
    const query = `SELECT * FROM find_or_create_google_user($1, $2, $3, $4)`;
    const values = [googleId, email, name, avatarUrl];

    const result = await pool.query(query, values);
    return result.rows[0];
}