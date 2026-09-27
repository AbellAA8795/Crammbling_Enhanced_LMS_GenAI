import express from "express";
import cors from "cors";
import passport from "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuth.route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());


// routes import

import loginRoutes from "./routes/login.route.js";
import userRoutes from "./routes/user.route.js";
import otpRoutes from "./routes/otp.route.js";


app.get("/", (req, res) => {
    res.send("Crammbling backend is running!");
});

// middleware
app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", googleAuthRoutes);




export default app;