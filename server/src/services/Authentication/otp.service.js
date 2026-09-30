import crypto from "crypto";
import transporter from "../../config/mailer.js";
import { insertOtp } from "../../models/Authentication/otp.model.js";

export async function generateAndSendOtp(email) {
    const otpCode = crypto.randomInt(100000, 999999).toString(); // 6-digit code
    const expiresMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;

    await insertOtp(email, otpCode, expiresMinutes);

    await transporter.sendMail({
        from: `"Crammbling" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your verification code",
        html: `
            <p>Your verification code is:</p>
            <h2>${otpCode}</h2>
            <p>This code expires in ${expiresMinutes} minutes. If you didn't request this, you can ignore this email.</p>
        `,
    });
}