import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());




// routes import

import loginRoutes from "./routes/login.route.js";
import userRoutes from "./routes/user.route.js";
import passport from "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuth.route.js";

app.get("/", (req, res) => {
    res.send("Crammbling backend is running!");
});

// middleware
app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);
app.use(passport.initialize());
app.use("/api/users", userRoutes);
app.use("/api/auth", googleAuthRoutes);




export default app;