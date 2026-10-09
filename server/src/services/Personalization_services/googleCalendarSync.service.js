import { google } from "googleapis";
import * as personalizationModel from "../../models/Personalization_services/personalization.model.js";
import { encryptToken, decryptToken } from "../../../utils/tokenCrypto.js";

function buildOAuthClient() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALENDAR_REDIRECT_URI
    );
}

export function getConsentUrl(stateToken) {
    const oauth2Client = buildOAuthClient();
    return oauth2Client.generateAuthUrl({
        access_type: "offline",      // required to receive a refresh_token
        prompt: "consent",           // force refresh_token on reconnect too, not just first grant
        scope: ["https://www.googleapis.com/auth/calendar.events"],
        state: stateToken,
    });
}

export async function exchangeCodeForTokens(code) {
    const oauth2Client = buildOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    // tokens.refresh_token is only present on the FIRST grant unless prompt=consent forces it again.
    if (!tokens.refresh_token) {
        throw new Error("Google did not return a refresh_token. Revoke prior access at https://myaccount.google.com/permissions and reconnect.");
    }
    return tokens; // { access_token, refresh_token, expiry_date, ... }
}

async function getAuthorizedClientForUser(userId) {
    const connection = await personalizationModel.getGoogleCalendarConnection(userId);
    if (!connection) {
        return null; // not connected — caller decides what to do
    }

    const oauth2Client = buildOAuthClient();
    const accessToken = decryptToken(connection.access_token);
    const refreshToken = decryptToken(connection.refresh_token);

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: new Date(connection.token_expiry).getTime(),
    });

    // Refresh proactively if the token is expired or expiring within 2 minutes.
    const isExpiring = new Date(connection.token_expiry).getTime() < Date.now() + 2 * 60 * 1000;
    if (isExpiring) {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        await personalizationModel.updateGoogleCalendarTokens({
            userId,
            accessToken: encryptToken(credentials.access_token),
            refreshToken: encryptToken(credentials.refresh_token || refreshToken), // Google usually doesn't resend refresh_token
            tokenExpiry: new Date(credentials.expiry_date),
        });
    }

    return { oauth2Client, calendarId: connection.calendar_id };
}

export async function createGoogleCalendarEvent(userId, { title, description, dueDate }) {
    const authorized = await getAuthorizedClientForUser(userId);
    if (!authorized) return null; // not connected — silently skip, caller leaves synced_to_google = false

    const calendar = google.calendar({ version: "v3", auth: authorized.oauth2Client });
    const response = await calendar.events.insert({
        calendarId: authorized.calendarId,
        requestBody: {
            summary: title,
            description: description || undefined,
            start: { dateTime: new Date(dueDate).toISOString() },
            end: { dateTime: new Date(dueDate).toISOString() },
        },
    });
    return response.data.id;
}

export async function updateGoogleCalendarEvent(userId, googleEventId, { title, description, dueDate }) {
    const authorized = await getAuthorizedClientForUser(userId);
    if (!authorized || !googleEventId) return;

    const calendar = google.calendar({ version: "v3", auth: authorized.oauth2Client });
    await calendar.events.patch({
        calendarId: authorized.calendarId,
        eventId: googleEventId,
        requestBody: {
            summary: title,
            description: description || undefined,
            start: { dateTime: new Date(dueDate).toISOString() },
            end: { dateTime: new Date(dueDate).toISOString() },
        },
    });
}

export async function deleteGoogleCalendarEvent(userId, googleEventId) {
    const authorized = await getAuthorizedClientForUser(userId);
    if (!authorized || !googleEventId) return;

    const calendar = google.calendar({ version: "v3", auth: authorized.oauth2Client });
    try {
        await calendar.events.delete({ calendarId: authorized.calendarId, eventId: googleEventId });
    } catch (err) {
        // 404/410 means it's already gone on Google's side — not a failure for our purposes.
        if (err.code !== 404 && err.code !== 410) throw err;
    }
}