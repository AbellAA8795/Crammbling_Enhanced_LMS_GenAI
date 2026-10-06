// server/src/routes/Notification_services/notification.route.js
import express from "express";
import verifyToken from "../../middleware/shared/verifyToken.js";
import {
    getNotificationsController,
    getUnreadCountController,
    markNotificationReadController,
    markAllReadController,
    deleteNotificationController,
    clearAllNotificationsController,
    notificationStreamController,
} from "../../controllers/Notification_services/notification.controller.js";

const router = express.Router();

// SSE stream authenticates itself via query-param token (see controller),
// so it's deliberately NOT behind the shared verifyToken middleware.
router.get("/stream", notificationStreamController);

router.use(verifyToken);

router.get("/", getNotificationsController);
router.get("/unread-count", getUnreadCountController);
router.patch("/:notificationId/read", markNotificationReadController);
router.patch("/read-all", markAllReadController);
router.delete("/:notificationId", deleteNotificationController);
router.delete("/", clearAllNotificationsController);

export default router;