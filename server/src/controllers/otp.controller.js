import { generateAndSendOtp } from "../services/otp.service.js";
import { verifyOtp } from "../models/otp.model.js";

export async function sendOtpController(req, res) {
    try {
        const { email } = req.body;

        await generateAndSendOtp(email);

        return res.status(200).json({
            success: true,
            message: "OTP sent to email."
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP."
        });
    }
}

export async function verifyOtpController(req, res) {
    try {
        const { email, otp } = req.body;

        const isValid = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP code."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP."
        });
    }
}