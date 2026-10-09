import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import redisClient from "../../config/redis.js";

// Limits how often a user can hit chat endpoints
export const chatRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many messages sent. Please wait a moment before trying again."
    },
    keyGenerator: (req) => {
        return req.user?.id?.toString() || ipKeyGenerator(req);
    },
});

// Stricter limiter specifically for file uploads
export const uploadRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many file uploads. Please wait before uploading again."
    },
    keyGenerator: (req) => {
        return req.user?.id?.toString() || ipKeyGenerator(req);
    },
});

// Limits how often a user can send friend requests — prevents mass-adding/spam
export const friendRequestRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many friend requests sent. Please wait before sending more."
    },
    keyGenerator: (req) => {
        return req.user?.id?.toString() || ipKeyGenerator(req);
    },
});

// Limits how often a user can search — prevents scraping the user directory
export const searchRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many searches. Please slow down."
    },
    keyGenerator: (req) => {
        return req.user?.id?.toString() || ipKeyGenerator(req);
    },
});

export const studyEventWriteRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 60,
    keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req),
    message: { success: false, message: "Too many study event changes. Please try again later." },
});

export const sprintTaskWriteRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 120,
    keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req),
    message: { success: false, message: "Too many sprint board changes. Please try again later." },
});

export const googleCalendarRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req),
    message: { success: false, message: "Too many Google Calendar connection attempts. Please try again later." },
});