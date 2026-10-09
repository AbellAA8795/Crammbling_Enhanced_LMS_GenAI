import express from "express";
import { verifyToken } from "../../middleware/shared/verifyToken.js"; // adjust to your real middleware path
import {
    studyEventWriteRateLimiter,
    sprintTaskWriteRateLimiter,
    googleCalendarRateLimiter,
} from "../../middleware/shared/rateLimiter.js";
import {
    createStudyEventController,
    getStudyEventsController,
    getStudyEventController,
    updateStudyEventController,
    deleteStudyEventController,
} from "../../controllers/Personalization_services/studyEvent.controller.js";
import {
    createSprintTaskController,
    getSprintTasksController,
    moveSprintTaskController,
    deleteSprintTaskController,
    clearSprintBoardController,
} from "../../controllers/Personalization_services/sprintTask.controller.js";
import {
    connectGoogleCalendarController,
    googleCalendarCallbackController,
    disconnectGoogleCalendarController,
    getGoogleCalendarStatusController,
} from "../../controllers/Personalization_services/googleCalendar.controller.js";

const router = express.Router();

// IMPORTANT: this route must come BEFORE router.use(verifyToken) below —
// Google's redirect carries no Authorization header, only ?code & ?state.
// It authenticates itself via the signed state token instead (see controller).
router.get("/google-calendar/callback", googleCalendarCallbackController);

router.use(verifyToken);

// Study Events
router.post("/study-events", studyEventWriteRateLimiter, createStudyEventController);
router.get("/study-events", getStudyEventsController);
router.get("/study-events/:eventId", getStudyEventController);
router.put("/study-events/:eventId", studyEventWriteRateLimiter, updateStudyEventController);
router.delete("/study-events/:eventId", studyEventWriteRateLimiter, deleteStudyEventController);

// Sprint Board
router.post("/sprint-tasks", sprintTaskWriteRateLimiter, createSprintTaskController);
router.get("/sprint-tasks", getSprintTasksController);
router.patch("/sprint-tasks/:taskId/move", sprintTaskWriteRateLimiter, moveSprintTaskController);
router.delete("/sprint-tasks/:taskId", sprintTaskWriteRateLimiter, deleteSprintTaskController);
router.delete("/sprint-tasks", sprintTaskWriteRateLimiter, clearSprintBoardController); // clear-all

// Google Calendar connection
router.get("/google-calendar/connect", googleCalendarRateLimiter, connectGoogleCalendarController);
router.delete("/google-calendar/disconnect", disconnectGoogleCalendarController);
router.get("/google-calendar/status", getGoogleCalendarStatusController);

export default router;