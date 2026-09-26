import {Router} from 'express';
import {userLogin} from '../controllers/login.controller.js';
const router = Router();

router.route("/login").post(userLogin);

export { router as default };