// server/src/services/Notification_services/notificationEvents.service.js
//
// In-memory registry mapping userId -> their open SSE response stream(s).
// A user can have more than one open connection (multiple tabs/devices),
// so each userId maps to a Set of response objects, not a single one.
//
// This is intentionally in-memory and single-process — fine for this
// project's scale. If this app ever runs on multiple server instances
// behind a load balancer, this would need to move to a shared pub/sub
// (Redis pub/sub is the natural upgrade path, reusing the Redis
// instance already in this stack) so a push reaches a user connected
// to a different instance.

const connections = new Map(); // userId -> Set<res>

export function registerConnection(userId, res) {
    if (!connections.has(userId)) {
        connections.set(userId, new Set());
    }
    connections.get(userId).add(res);
}

export function removeConnection(userId, res) {
    const userConnections = connections.get(userId);
    if (!userConnections) return;
    userConnections.delete(res);
    if (userConnections.size === 0) {
        connections.delete(userId);
    }
}

export function pushNotificationToUser(userId, notification) {
    const userConnections = connections.get(userId);
    if (!userConnections || userConnections.size === 0) {
        return false; // user has no open tab right now — notification is still saved in DB for later
    }
    const payload = `data: ${JSON.stringify(notification)}\n\n`;
    for (const res of userConnections) {
        res.write(payload);
    }
    return true;
}

export function getConnectionCount(userId) {
    return connections.get(userId)?.size || 0;
}