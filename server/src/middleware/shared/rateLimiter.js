import rateLimit, { ipKeyGenerator } from "express-rate-limit";

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