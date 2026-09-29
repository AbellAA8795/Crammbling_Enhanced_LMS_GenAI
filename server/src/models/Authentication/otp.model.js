import pool from "../../config/database.js";

export async function insertOtp(email, otpCode, expiresMinutes) {
    const query = `CALL insert_otp_procedure($1, $2, $3)`;
    await pool.query(query, [email, otpCode, expiresMinutes]);
}

export async function verifyOtp(email, otpCode) {
    const query = `SELECT verify_otp_function($1, $2) AS is_valid`;
    const result = await pool.query(query, [email, otpCode]);
    return result.rows[0].is_valid;
}