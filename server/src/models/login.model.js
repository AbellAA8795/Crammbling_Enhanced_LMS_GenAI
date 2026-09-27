import pool from "../config/database.js";

export async function verifyLogin(email, password) {
    const query = `CALL verify_login_procedure($1, $2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`;
    const result = await pool.query(query, [email, password]);

    const row = result.rows[0];

    // If no user matched the email, user_id will be null
    if (!row || row.o_user_id === null) {
        return null;
    }

    return {
        user_id: row.o_user_id,
        username: row.o_username,
        email: row.o_email,
        phone_number: row.o_phone_number,
        avatar_url: row.o_avatar_url,
        auth_provider: row.o_auth_provider,
        is_verified: row.o_is_verified,
        is_password_valid: row.o_is_password_valid,
    };
}