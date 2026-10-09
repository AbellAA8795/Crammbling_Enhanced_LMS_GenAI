import jwt from "jsonwebtoken";
import { verifyLogin } from "../../models/Authentication/login.model.js";

export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await verifyLogin(email, password);

        // No account with this email at all
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Wrong password OR this is a Google-only account with no password set
        if (!user.is_password_valid) {
            return res.status(401).json({
                success: false,
                message: user.auth_provider === "google"
                    ? "This account uses Google Sign-In. Please log in with Google instead."
                    : "Invalid email or password."
            });
        }

        // Correct credentials, but local account not yet verified via OTP
        if (user.auth_provider === "local" && !user.is_verified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in."
            });
        }

        const token = jwt.sign(
            {
                id: user.user_id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phone_number,
                avatarUrl: user.avatar_url,
                authProvider: user.auth_provider,
                isVerified: user.is_verified,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to log in."
        });
    }
}