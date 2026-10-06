// server/src/routes/Social_services/social.route.js
import express from "express";
import verifyToken from "../../middleware/shared/verifyToken.js";
import { friendRequestRateLimiter, searchRateLimiter } from "../../middleware/shared/rateLimiter.js"
import {
    searchUsersController,
    getProfileController,
    sendFriendRequestController,
    respondToFriendRequestController,
    cancelFriendRequestController,
    removeFriendController,
    getFriendsListController,
    getPendingRequestsController,
} from "../../controllers/Social_services/social.controller.js";

const router = express.Router();

router.use(verifyToken); // every route below requires a logged-in user

router.get("/search", searchRateLimiter, searchUsersController);
router.get("/profile/:userId", getProfileController);

router.post("/friend-requests", friendRequestRateLimiter, sendFriendRequestController);
router.get("/friend-requests", getPendingRequestsController);          // ?direction=incoming|outgoing
router.patch("/friend-requests/:requestId", respondToFriendRequestController); // { action: 'accept'|'decline' }
router.delete("/friend-requests/:requestId", cancelFriendRequestController);

router.get("/friends", getFriendsListController);
router.delete("/friends/:friendId", removeFriendController);

export default router;