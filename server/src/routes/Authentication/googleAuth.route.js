import express from "express";
import passport, { googleAuthEnabled } from "../../config/passport.js";
import { googleCallbackController } from "../../controllers/Authentication/googleAuth.controller.js";

const router = express.Router();

// No Google credentials configured (see config/passport.js).
router.use((req, res, next) => {
    if (googleAuthEnabled) return next();
    return res.status(503).json({
        success: false,
        message: "Google sign-in isn't configured on this server. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
    });
});

// Step 1: kick off the Google login
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Step 2: Google redirects back here
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" }),
    googleCallbackController
);

router.get("/google/failure", (req, res) => {
    res.status(401).json({
        success: false,
        message: "Google authentication failed or was cancelled."
    });
});

export default router;