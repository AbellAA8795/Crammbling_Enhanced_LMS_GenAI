import express from "express";
import { loginController } from "../../controllers/Authentication/login.controller.js";
import { validateLogin } from "../../middleware/Authentication/loginMiddleware.js";

const router = express.Router();

router.post("/", validateLogin, loginController);

export default router;