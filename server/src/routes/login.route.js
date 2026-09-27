import express from "express";
import { loginController } from "../controllers/login.controller.js";
import { validateLogin } from "../middleware/loginMiddleware.js";

const router = express.Router();

router.post("/", validateLogin, loginController);

export default router;