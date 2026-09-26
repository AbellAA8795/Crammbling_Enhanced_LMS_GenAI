import express from "express";
import passport from "../config/passport.js";
import { googleCallbackController } from "../controllers/googleAuth.controller.js";

const router = express.Router();

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