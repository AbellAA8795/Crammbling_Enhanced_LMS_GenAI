import jwt from "jsonwebtoken";
import * as personalizationModel from "../../models/Personalization_services/personalization.model.js";
import * as calendarSync from "../../services/Personalization_services/googleCalendarSync.service.js";
import { encryptToken } from "../../../utils/tokenCrypto.js";

function getClientIp(req) {
    return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
}

export async function connectGoogleCalendarController(req, res) {
    try {
        // Short-lived signed state token carries the user id through Google's
        // redirect, since Google's callback has no Authorization header.
        const stateToken = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: "10m" });
        const consentUrl = calendarSync.getConsentUrl(stateToken);
        return res.status(200).json({ success: true, data: { consentUrl } });
    } catch (err) {
        console.error("connectGoogleCalendarController error:", err);
        return res.status(500).json({ success: false, message: "Failed to start Google Calendar connection." });
    }
}

export async function googleCalendarCallbackController(req, res) {
    try {
        const { code, state, error } = req.query;

        if (error) {
            return res.status(400).json({ success: false, message: `Google denied access: ${error}` });
        }
        if (!code || !state) {
            return res.status(400).json({ success: false, message: "Missing code or state from Google." });
        }

        let statePayload;
        try {
            statePayload = jwt.verify(state, process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({ success: false, message: "Invalid or expired state token." });
        }

        const tokens = await calendarSync.exchangeCodeForTokens(code);

        await personalizationModel.upsertGoogleCalendarConnection({
            userId: statePayload.userId,
            accessToken: encryptToken(tokens.access_token),
            refreshToken: encryptToken(tokens.refresh_token),
            tokenExpiry: new Date(tokens.expiry_date),
            calendarId: "primary",
            ipAddress: getClientIp(req),
        });

        // Backend-only testing mode, same as the Google login controller:
        return res.status(200).json({ success: true, message: "Google Calendar connected." });
        // In production: return res.redirect(`${process.env.FRONTEND_URL}/settings?calendarConnected=true`);
    } catch (err) {
        console.error("googleCalendarCallbackController error:", err);
        return res.status(500).json({ success: false, message: "Failed to complete Google Calendar connection." });
    }
}

export async function disconnectGoogleCalendarController(req, res) {
    try {
            const status = await personalizationModel.deleteGoogleCalendarConnection(req.user.id, getClientIp(req));

        if (status === "not_found") {
            return res.status(404).json({ success: false, message: "No Google Calendar connection found." });
        }
        return res.status(200).json({ success: true, message: "Google Calendar disconnected." });
    } catch (err) {
        console.error("disconnectGoogleCalendarController error:", err);
        return res.status(500).json({ success: false, message: "Failed to disconnect Google Calendar." });
    }
}

export async function getGoogleCalendarStatusController(req, res) {
    try {
        const connection = await personalizationModel.getGoogleCalendarConnection(req.user.id);
        return res.status(200).json({ success: true, data: { connected: !!connection } });
    } catch (err) {
        console.error("getGoogleCalendarStatusController error:", err);
        return res.status(500).json({ success: false, message: "Failed to check Google Calendar status." });
    }
}