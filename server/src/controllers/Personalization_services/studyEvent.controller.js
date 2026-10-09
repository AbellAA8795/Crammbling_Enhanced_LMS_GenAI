import * as personalizationModel from "../../models/Personalization_services/personalization.model.js";
import * as calendarSync from "../../services/Personalization_services/googleCalendarSync.service.js";

export async function createStudyEventController(req, res) {
    try {
        const { title, type, dueDate, subject, description } = req.body;
        if (!title || !type || !dueDate || !subject) {
            return res.status(400).json({ success: false, message: "title, type, dueDate, and subject are required." });
        }

        const eventId = await personalizationModel.createStudyEvent({
            userId: req.user.id, title, type, dueDate, subject, description,
        });

        // Best-effort Google Calendar sync — never block the response on it.
        try {
            const googleEventId = await calendarSync.createGoogleCalendarEvent(req.user.id, { title, description, dueDate });
            if (googleEventId) {
                await personalizationModel.updateGoogleSyncStatus(eventId, req.user.id, googleEventId);
            }
        } catch (syncErr) {
            console.error("Google Calendar sync failed (event still saved locally):", syncErr.message);
        }

        return res.status(201).json({ success: true, message: "Study event created.", data: { eventId } });
    } catch (err) {
        console.error("createStudyEventController error:", err);
        return res.status(500).json({ success: false, message: "Failed to create study event." });
    }
}

export async function getStudyEventsController(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const events = await personalizationModel.getStudyEvents(req.user.id, startDate, endDate);
        return res.status(200).json({ success: true, data: events });
    } catch (err) {
        console.error("getStudyEventsController error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch study events." });
    }
}

export async function getStudyEventController(req, res) {
    try {
        const event = await personalizationModel.getStudyEvent(req.params.eventId, req.user.id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Study event not found." });
        }
        return res.status(200).json({ success: true, data: event });
    } catch (err) {
        console.error("getStudyEventController error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch study event." });
    }
}

export async function updateStudyEventController(req, res) {
    try {
        const { title, type, dueDate, subject, description } = req.body;
        if (!title || !type || !dueDate || !subject) {
            return res.status(400).json({ success: false, message: "title, type, dueDate, and subject are required." });
        }

        const status = await personalizationModel.updateStudyEvent({
            eventId: req.params.eventId, userId: req.user.id, title, type, dueDate, subject, description,
        });

        if (status === "not_found") return res.status(404).json({ success: false, message: "Study event not found." });
        if (status === "forbidden") return res.status(403).json({ success: false, message: "You do not own this study event." });

        // Best-effort Google Calendar update.
        try {
            const event = await personalizationModel.getStudyEvent(req.params.eventId, req.user.id);
            if (event?.google_calendar_event_id) {
                await calendarSync.updateGoogleCalendarEvent(req.user.id, event.google_calendar_event_id, { title, description, dueDate });
            }
        } catch (syncErr) {
            console.error("Google Calendar update sync failed:", syncErr.message);
        }

        return res.status(200).json({ success: true, message: "Study event updated." });
    } catch (err) {
        console.error("updateStudyEventController error:", err);
        return res.status(500).json({ success: false, message: "Failed to update study event." });
    }
}

export async function deleteStudyEventController(req, res) {
    try {
        const { googleCalendarEventId, status } = await personalizationModel.deleteStudyEvent(req.params.eventId, req.user.id);

        if (status === "not_found") return res.status(404).json({ success: false, message: "Study event not found." });
        if (status === "forbidden") return res.status(403).json({ success: false, message: "You do not own this study event." });

        if (googleCalendarEventId) {
            try {
                await calendarSync.deleteGoogleCalendarEvent(req.user.id, googleCalendarEventId);
            } catch (syncErr) {
                console.error("Google Calendar delete sync failed:", syncErr.message);
            }
        }

        return res.status(200).json({ success: true, message: "Study event deleted." });
    } catch (err) {
        console.error("deleteStudyEventController error:", err);
        return res.status(500).json({ success: false, message: "Failed to delete study event." });
    }
}