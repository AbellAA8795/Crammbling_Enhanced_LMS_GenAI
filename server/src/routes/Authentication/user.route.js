import express from "express";

import { createUserController } from "../../controllers/Authentication/user.controller.js";
import { validateCreateUser } from "../../middleware/Authentication/userMiddleware.js";

const router = express.Router();

router.post(
    "/",
    validateCreateUser,
    createUserController
);

export default router;