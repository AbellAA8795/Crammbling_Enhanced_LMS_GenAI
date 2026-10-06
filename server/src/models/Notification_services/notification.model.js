// server/src/models/Notification_services/notification.model.js
import pool from "../../config/database.js";

export async function createNotification(recipientUserId, type, title, message, data = {}) {
    const query = `CALL notification.create_notification_procedure($1, $2, $3, $4, $5, NULL)`;
    const result = await pool.query(query, [recipientUserId, type, title, message, JSON.stringify(data)]);
    return result.rows[0].o_notification_id;
}

export async function getNotifications(userId, limit = 50, offset = 0) {
    const result = await pool.query(
        `SELECT * FROM notification.get_notifications_function($1, $2, $3)`,
        [userId, limit, offset]
    );
    return result.rows;
}

export async function getUnreadCount(userId) {
    const result = await pool.query(
        `SELECT notification.get_unread_count_function($1) AS count`,
        [userId]
    );
    return result.rows[0].count;
}

export async function markNotificationRead(notificationId, userId) {
    const result = await pool.query(
        `CALL notification.mark_notification_read_procedure($1, $2, NULL)`,
        [notificationId, userId]
    );
    return { status: result.rows[0].o_status };
}

export async function markAllRead(userId) {
    const result = await pool.query(
        `CALL notification.mark_all_read_procedure($1, NULL)`,
        [userId]
    );
    return { markedCount: result.rows[0].o_marked_count };
}

export async function deleteNotification(notificationId, userId) {
    const result = await pool.query(
        `CALL notification.delete_notification_procedure($1, $2, NULL)`,
        [notificationId, userId]
    );
    return { status: result.rows[0].o_status };
}

export async function clearAllNotifications(userId) {
    const result = await pool.query(
        `CALL notification.clear_all_notifications_procedure($1, NULL)`,
        [userId]
    );
    return { deletedCount: result.rows[0].o_deleted_count };
}