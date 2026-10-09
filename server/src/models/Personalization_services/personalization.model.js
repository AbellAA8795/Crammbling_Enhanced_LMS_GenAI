import pool from "../../config/database.js"; // adjust to your actual pool export path/name

// ---------- Study Events ----------

export async function createStudyEvent({ userId, title, type, dueDate, subject, description }) {
    const result = await pool.query(
        `CALL personalization.create_study_event_procedure($1,$2,$3,$4,$5,$6,$7)`,
        [userId, title, type, dueDate, subject, description ?? null, null]
    );
    return result.rows[0].o_event_id;
}

export async function getStudyEvents(userId, startDate, endDate) {
    const result = await pool.query(
        `SELECT * FROM personalization.get_study_events_function($1,$2,$3)`,
        [userId, startDate ?? null, endDate ?? null]
    );
    return result.rows;
}

export async function getStudyEvent(eventId, userId) {
    const result = await pool.query(
        `SELECT * FROM personalization.get_study_event_function($1,$2)`,
        [eventId, userId]
    );
    return result.rows[0] ?? null;
}

export async function updateStudyEvent({ eventId, userId, title, type, dueDate, subject, description }) {
    const result = await pool.query(
        `CALL personalization.update_study_event_procedure($1,$2,$3,$4,$5,$6,$7,$8)`,
        [eventId, userId, title, type, dueDate, subject, description ?? null, null]
    );
    return result.rows[0].o_status;
}

export async function deleteStudyEvent(eventId, userId) {
    const result = await pool.query(
        `CALL personalization.delete_study_event_procedure($1,$2,$3,$4)`,
        [eventId, userId, null, null]
    );
    return { googleCalendarEventId: result.rows[0].o_google_calendar_event_id, status: result.rows[0].o_status };
}

export async function updateGoogleSyncStatus(eventId, userId, googleCalendarEventId) {
    const result = await pool.query(
        `CALL personalization.update_google_sync_status_procedure($1,$2,$3,$4)`,
        [eventId, userId, googleCalendarEventId, null]
    );
    return result.rows[0].o_status;
}

// ---------- Sprint Tasks ----------

export async function createSprintTask({ userId, title, subject }) {
    const result = await pool.query(
        `CALL personalization.create_sprint_task_procedure($1,$2,$3,$4)`,
        [userId, title, subject, null]
    );
    return result.rows[0].o_task_id;
}

export async function getSprintTasks(userId) {
    const result = await pool.query(
        `SELECT * FROM personalization.get_sprint_tasks_function($1)`,
        [userId]
    );
    return result.rows;
}

export async function moveSprintTask({ taskId, userId, newStatus, newPosition }) {
    const result = await pool.query(
        `CALL personalization.move_sprint_task_procedure($1,$2,$3,$4,$5)`,
        [taskId, userId, newStatus, newPosition, null]
    );
    return result.rows[0].o_status;
}

export async function deleteSprintTask(taskId, userId) {
    const result = await pool.query(
        `CALL personalization.delete_sprint_task_procedure($1,$2,$3)`,
        [taskId, userId, null]
    );
    return result.rows[0].o_status;
}

export async function clearSprintBoard(userId) {
    const result = await pool.query(
        `CALL personalization.clear_sprint_board_procedure($1,$2)`,
        [userId, null]
    );
    return result.rows[0].o_deleted_count;
}

// ---------- Google Calendar connection ----------

export async function upsertGoogleCalendarConnection({ userId, accessToken, refreshToken, tokenExpiry, calendarId, ipAddress }) {
    const result = await pool.query(
        `CALL personalization.upsert_google_calendar_connection_procedure($1,$2,$3,$4,$5,$6,$7)`,
        [userId, accessToken, refreshToken, tokenExpiry, calendarId ?? "primary", ipAddress ?? null, null]
    );
    return result.rows[0].o_status;
}

export async function updateGoogleCalendarTokens({ userId, accessToken, refreshToken, tokenExpiry }) {
    const result = await pool.query(
        `CALL personalization.update_google_calendar_tokens_procedure($1,$2,$3,$4,$5)`,
        [userId, accessToken, refreshToken, tokenExpiry, null]
    );
    return result.rows[0].o_status;
}

export async function getGoogleCalendarConnection(userId) {
    const result = await pool.query(
        `SELECT * FROM personalization.get_google_calendar_connection_function($1)`,
        [userId]
    );
    return result.rows[0] ?? null;
}

export async function deleteGoogleCalendarConnection(userId, ipAddress) {
    const result = await pool.query(
        `CALL personalization.delete_google_calendar_connection_procedure($1,$2,$3)`,
        [userId, ipAddress ?? null, null]
    );
    return result.rows[0].o_status;
}