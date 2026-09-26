import jwt from "jsonwebtoken";

export function googleCallbackController(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Google authentication failed."
            });
        }

        const token = jwt.sign(
            {
                id: req.user.user_id,
                email: req.user.email,
                username: req.user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Logged in with Google successfully.",
            token,
            user: {
                id: req.user.user_id,
                username: req.user.username,
                email: req.user.email,
                avatarUrl: req.user.avatar_url,
                authProvider: req.user.auth_provider,
                isVerified: req.user.is_verified
            }
        });
    } catch (error) {
        console.error("Error in Google callback:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to complete Google login."
        });
    }
}