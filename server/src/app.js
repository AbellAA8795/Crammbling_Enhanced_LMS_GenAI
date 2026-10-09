import express from "express";
import cors from "cors";
import passport from "./config/passport.js";
import googleAuthRoutes from "./routes/Authentication/googleAuth.route.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(passport.initialize());


// routes import

import loginRoutes from "./routes/Authentication/login.route.js";
import userRoutes from "./routes/Authentication/user.route.js";
import otpRoutes from "./routes/Authentication/otp.route.js";
import chatRoutes from "./routes/Chatbot_services/chat.route.js";
import promptRoutes from "./routes/Chatbot_services/prompt.route.js";
import feedbackRoutes from "./routes/Chatbot_services/feedback.route.js";
import socialRoutes from "./routes/Social_services/social.route.js";
import notificationRoutes from "./routes/Notification_services/notification.route.js";
import personalizationRoutes from "./routes/Personalization_services/personalization.route.js";

app.get("/", (req, res) => {
    res.send("Crammbling backend is running!");
});

// middleware
app.use("/api/login", loginRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/chat", feedbackRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/personalization", personalizationRoutes);

app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "File is too large. Maximum size is 5MB."
        });
    }
    if (err.message === "FILE_TYPE_NOT_ALLOWED") {
        return res.status(400).json({
            success: false,
            message: "File type not allowed. Only PDF, TXT, PNG, and JPEG are accepted."
        });
    }
    console.error("Unhandled error:", err);
    return res.status(500).json({
        success: false,
        message: "Something went wrong."
    });
});

export default app;