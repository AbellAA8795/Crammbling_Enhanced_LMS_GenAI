import { createUser } from "../models/user.model.js";

export async function createUserController(req, res) {

    try {

        const {
            username,
            email,
            password,
            phonenumber
        } = req.body;

        await createUser(
            username,
            email,
            password,
            phonenumber
        );

        res.status(201).json({
            success: true,
            message: "User created successfully."
        });

    } catch (error) {

        console.error("Error creating user:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create user."
        });
    }
}