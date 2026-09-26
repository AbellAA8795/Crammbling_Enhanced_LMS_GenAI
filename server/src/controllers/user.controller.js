import { createUser } from "../models/user.model.js";

export async function createUserController(req, res) {
    try {
        const { username, email, password, phonenumber } = req.body;

        await createUser(username, email, password, phonenumber);

        return res.status(201).json({
            success: true,
            message: "User created successfully."
        });

    } catch (error) {
        console.error("Error creating user:", error);

        const message = error.message || "";

        if (message.includes("USERNAME_EXISTS")) {
            return res.status(409).json({
                success: false,
                message: "Username already exists."
            });
        }

        if (message.includes("EMAIL_IS_GOOGLE_ACCOUNT")) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered via Google Sign-In. Please use 'Sign in with Google' instead."
            });
        }

        if (message.includes("EMAIL_EXISTS")) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create user."
        });
    }
}