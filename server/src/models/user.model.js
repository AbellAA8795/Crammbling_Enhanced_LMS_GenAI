import pool from "../config/database.js";

export async function createUser(
    username,
    email,
    password,
    phonenumber
) {
    const query = `
        CALL create_user_procedure($1, $2, $3, $4)
    `;

    const values = [
        username,
        email,
        password,
        phonenumber
    ];

    await pool.query(query, values);
}