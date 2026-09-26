import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());




// routes import

import loginRoutes from "./routes/login.route.js";
import userRoutes from "./routes/user.route.js";

app.get("/", (req, res) => {
    res.send("Crammbling backend is running!");
});

// middleware
app.use("/api/login", loginRoutes);
app.use("/api/users", userRoutes);







export default app;