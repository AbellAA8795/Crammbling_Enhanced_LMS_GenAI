// server/src/controllers/Notification_services/notification.controller.js
import jwt from "jsonwebtoken";
import * as notificationModel from "../../models/Notification_services/notification.model.js";
import { registerConnection, removeConnection } from "../../services/Notification_services/notificationEvents.service.js";

export async function getNotificationsController(req, res) {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
        const offset = parseInt(req.query.offset, 10) || 0;
        const notifications = await notificationModel.getNotifications(req.user.id, limit, offset);
        res.json({ success: true, data: notifications });
    } catch (err) {
        console.error("getNotificationsController error:", err);
        res.status(500).json({ success: false, message: "Could not load notifications." });
    }
}

export async function getUnreadCountController(req, res) {
    try {
        const count = await notificationModel.getUnreadCount(req.user.id);
        res.json({ success: true, data: { count } });
    } catch (err) {
        console.error("getUnreadCountController error:", err);
        res.status(500).json({ success: false, message: "Could not load unread count." });
    }
}

export async function markNotificationReadController(req, res) {
    try {
        const notificationId = parseInt(req.params.notificationId, 10);
        const { status } = await notificationModel.markNotificationRead(notificationId, req.user.id);

        const statusMap = {
            marked_read: { code: 200, message: "Notification marked as read." },
            not_found: { code: 404, message: "Notification not found." },
            forbidden: { code: 403, message: "You cannot modify this notification." },
            already_read: { code: 200, message: "Notification was already read." },
        };
        const outcome = statusMap[status] || { code: 500, message: "Unexpected error." };
        res.status(outcome.code).json({ success: status !== "not_found" && status !== "forbidden", status, message: outcome.message });
    } catch (err) {
        console.error("markNotificationReadController error:", err);
        res.status(500).json({ success: false, message: "Could not mark notification as read." });
    }
}

export async function markAllReadController(req, res) {
    try {
        const { markedCount } = await notificationModel.markAllRead(req.user.id);
        res.json({ success: true, message: `${markedCount} notification(s) marked as read.`, markedCount });
    } catch (err) {
        console.error("markAllReadController error:", err);
        res.status(500).json({ success: false, message: "Could not mark notifications as read." });
    }
}

export async function deleteNotificationController(req, res) {
    try {
        const notificationId = parseInt(req.params.notificationId, 10);
        const { status } = await notificationModel.deleteNotification(notificationId, req.user.id);

        const statusMap = {
            deleted: { code: 200, message: "Notification removed." },
            not_found: { code: 404, message: "Notification not found." },
            forbidden: { code: 403, message: "You cannot delete this notification." },
        };
        const outcome = statusMap[status] || { code: 500, message: "Unexpected error." };
        res.status(outcome.code).json({ success: status === "deleted", status, message: outcome.message });
    } catch (err) {
        console.error("deleteNotificationController error:", err);
        res.status(500).json({ success: false, message: "Could not remove notification." });
    }
}

export async function clearAllNotificationsController(req, res) {
    try {
        const { deletedCount } = await notificationModel.clearAllNotifications(req.user.id);
        res.json({ success: true, message: `${deletedCount} notification(s) cleared.`, deletedCount });
    } catch (err) {
        console.error("clearAllNotificationsController error:", err);
        res.status(500).json({ success: false, message: "Could not clear notifications." });
    }
}

// =====================================================================
// SSE stream endpoint. Browsers' native EventSource API cannot send
// custom headers, so the JWT arrives as a query parameter here instead
// of the usual Authorization header — this route therefore does its
// own token verification rather than using the shared verifyToken
// middleware, which only reads the header.
// =====================================================================
export function notificationStreamController(req, res) {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Missing token." });
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }

    const userId = payload.id;

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });
    res.flushHeaders();

    registerConnection(userId, res);

    // Keep the connection alive through proxies/load balancers that
    // close idle connections — a comment line, not a real event, so the
    // frontend's EventSource onmessage handler ignores it.
    const keepAliveInterval = setInterval(() => {
        res.write(": keep-alive\n\n");
    }, 30000);

    req.on("close", () => {
        clearInterval(keepAliveInterval);
        removeConnection(userId, res);
    });
}