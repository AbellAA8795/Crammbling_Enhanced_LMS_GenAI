import express from "express";

import {
    createUserController
} from "../controllers/user.controller.js";

import {
    validateCreateUser
} from "../middleware/userMiddleware.js";

const router = express.Router();

router.post(
    "/",
    validateCreateUser,
    createUserController
);

export default router;