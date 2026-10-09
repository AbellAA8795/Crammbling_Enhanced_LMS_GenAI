import { apiRequest } from "./client";

const API_URL = import.meta.env.VITE_API_URL;

export function listNotifications(limit = 30) {
    return apiRequest(`/api/notifications?limit=${limit}`);
}

export function getUnreadCount() {
    return apiRequest("/api/notifications/unread-count");
}

export function markNotificationRead(id) {
    return apiRequest(`/api/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
    return apiRequest("/api/notifications/read-all", { method: "PATCH" });
}

export function deleteNotification(id) {
    return apiRequest(`/api/notifications/${id}`, { method: "DELETE" });
}

export function clearNotifications() {
    return apiRequest("/api/notifications", { method: "DELETE" });
}

// Live updates. EventSource can't send headers, so the server reads the
// token from the query string (see notificationStreamController).
export function openNotificationStream(token, onNotification) {
    const source = new EventSource(`${API_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`);
    source.onmessage = (e) => {
        try {
            onNotification(JSON.parse(e.data));
        } catch {
            /* keep-alive or malformed line — ignore */
        }
    };
    return source;
}
