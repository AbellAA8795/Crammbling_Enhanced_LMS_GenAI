// server/src/models/Social_services/social.model.js
import pool from "../../config/database.js";

export async function searchUsers(query, requestingUserId) {
    const result = await pool.query(
        `SELECT * FROM social.search_users_function($1, $2)`,
        [query, requestingUserId]
    );
    return result.rows;
}

export async function getUserProfile(targetUserId, requestingUserId) {
    const result = await pool.query(
        `SELECT * FROM social.get_user_profile_function($1, $2)`,
        [targetUserId, requestingUserId]
    );
    return result.rows[0] || null;
}

export async function sendFriendRequest(requesterId, recipientId, ipAddress) {
    const result = await pool.query(
        `CALL social.send_friend_request_procedure($1, $2, $3, NULL, NULL)`,
        [requesterId, recipientId, ipAddress]
    );
    return { requestId: result.rows[0].o_request_id, status: result.rows[0].o_status };
}

export async function respondToFriendRequest(requestId, responderId, action, ipAddress) {
    const result = await pool.query(
        `CALL social.respond_friend_request_procedure($1, $2, $3, $4, NULL)`,
        [requestId, responderId, action, ipAddress]
    );
    return { status: result.rows[0].o_status };
}

export async function cancelFriendRequest(requestId, requesterId) {
    const result = await pool.query(
        `CALL social.cancel_friend_request_procedure($1, $2, NULL)`,
        [requestId, requesterId]
    );
    return { status: result.rows[0].o_status };
}

export async function removeFriend(userId, friendId, ipAddress) {
    const result = await pool.query(
        `CALL social.remove_friend_procedure($1, $2, $3, NULL)`,
        [userId, friendId, ipAddress]
    );
    return { status: result.rows[0].o_status };
}

export async function getFriendsList(userId) {
    const result = await pool.query(
        `SELECT * FROM social.get_friends_list_function($1)`,
        [userId]
    );
    return result.rows;
}

export async function getPendingRequests(userId, direction) {
    const result = await pool.query(
        `SELECT * FROM social.get_pending_requests_function($1, $2)`,
        [userId, direction]
    );
    return result.rows;
}