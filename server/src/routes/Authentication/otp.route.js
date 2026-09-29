import express from "express";
import { sendOtpController, verifyOtpController } from "../../controllers/Authentication/otp.controller.js";
import { validateOtpRequest, validateOtpVerify } from "../../middleware/Authentication/otpMiddleware.js";

const router = express.Router();

router.post("/send", validateOtpRequest, sendOtpController);
router.post("/verify", validateOtpVerify, verifyOtpController);

export default router;