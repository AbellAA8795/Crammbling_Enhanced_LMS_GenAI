// server/src/controllers/Social_services/social.controller.js
import * as socialModel from "../../models/Social_services/social.model.js";
import {
    getCachedFriendsList, setCachedFriendsList, invalidateFriendsList,
    getCachedProfile, setCachedProfile, invalidateProfile,
} from "../../services/Social_services/socialCache.service.js";

function getClientIp(req) {
    return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
}

export async function searchUsersController(req, res) {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ success: false, message: "Search query must be at least 2 characters." });
        }
        const results = await socialModel.searchUsers(q.trim(), req.user.id);
        res.json({ success: true, data: results });
    } catch (err) {
        console.error("searchUsersController error:", err);
        res.status(500).json({ success: false, message: "Search failed." });
    }
}

export async function getProfileController(req, res) {
    try {
        const targetUserId = parseInt(req.params.userId, 10);
        if (Number.isNaN(targetUserId)) {
            return res.status(400).json({ success: false, message: "Invalid user id." });
        }

        const cached = await getCachedProfile(targetUserId, req.user.id);
        if (cached) return res.json({ success: true, data: cached, cached: true });

        const profile = await socialModel.getUserProfile(targetUserId, req.user.id);
        if (!profile) return res.status(404).json({ success: false, message: "User not found." });

        await setCachedProfile(targetUserId, req.user.id, profile);
        res.json({ success: true, data: profile, cached: false });
    } catch (err) {
        console.error("getProfileController error:", err);
        res.status(500).json({ success: false, message: "Could not load profile." });
    }
}

export async function sendFriendRequestController(req, res) {
    try {
        const { recipientId } = req.body;
        const recipientIdNum = parseInt(recipientId, 10);
        if (Number.isNaN(recipientIdNum)) {
            return res.status(400).json({ success: false, message: "recipientId is required." });
        }

        const { requestId, status } = await socialModel.sendFriendRequest(
            req.user.id, recipientIdNum, getClientIp(req)
        );

        const statusMap = {
            created: { code: 201, message: "Friend request sent." },
            already_friends: { code: 409, message: "You are already friends with this user." },
            already_pending: { code: 409, message: "A friend request already exists between you two." },
            self_request: { code: 400, message: "You cannot add yourself." },
            recipient_not_found: { code: 404, message: "User not found." },
        };
        const outcome = statusMap[status] || { code: 500, message: "Unexpected error." };
        res.status(outcome.code).json({ success: status === "created", status, message: outcome.message, requestId });
    } catch (err) {
        console.error("sendFriendRequestController error:", err);
        res.status(500).json({ success: false, message: "Could not send friend request." });
    }
}

export async function respondToFriendRequestController(req, res) {
    try {
        console.log("req.user in respondToFriendRequestController:", req.user);
        const requestId = parseInt(req.params.requestId, 10);
        const { action } = req.body

        const { status } = await socialModel.respondToFriendRequest(
            requestId, req.user.id, action, getClientIp(req)
        );

        if (status === "accepted") {
            await invalidateFriendsList(req.user.id);
            await invalidateProfile(req.user.id);
        }

        const statusMap = {
            accepted: { code: 200, message: "Friend request accepted." },
            declined: { code: 200, message: "Friend request declined." },
            not_found: { code: 404, message: "Friend request not found." },
            forbidden: { code: 403, message: "You cannot respond to this request." },
            invalid_action: { code: 400, message: "action must be 'accept' or 'decline'." },
            already_resolved: { code: 409, message: "This request was already handled." },
        };
        const outcome = statusMap[status] || { code: 500, message: "Unexpected error." };
        res.status(outcome.code).json({ success: ["accepted", "declined"].includes(status), status, message: outcome.message });
    } catch (err) {
        console.error("respondToFriendRequestController error:", err);
        res.status(500).json({ success: false, message: "Could not respond to friend request." });
    }
}

export async function cancelFriendRequestController(req, res) {
    try {
        const requestId = parseInt(req.params.requestId, 10);
        const { status } = await socialModel.cancelFriendRequest(requestId, req.user.id);

        const statusMap = {
            cancelled: { code: 200, message: "Friend request cancelled." },
            not_found: { code: 404, message: "Friend request not found." },
            forbidden: { code: 403, message: "You cannot cancel this request." },
            already_resolved: { code: 409, message: "This request was already handled." },
        };
        const outcome = statusMap[status] || { code: 500, message: "Unexpected error." };
        res.status(outcome.code).json({ success: status === "cancelled", status, message: outcome.message });
    } catch (err) {
        console.error("cancelFriendRequestController error:", err);
        res.status(500).json({ success: false, message: "Could not cancel friend request." });
    }
}

export async function removeFriendController(req, res) {
    try {
        const friendId = parseInt(req.params.friendId, 10);
        const { status } = await socialModel.removeFriend(req.user.id, friendId, getClientIp(req));

        if (status === "removed") {
            await invalidateFriendsList(req.user.id);
            await invalidateFriendsList(friendId);
            await invalidateProfile(req.user.id);
            await invalidateProfile(friendId);
        }

        const statusMap = {
            removed: { code: 200, message: "Friend removed." },
            not_friends: { code: 404, message: "You are not friends with this user." },
        };
        const outcome = statusMap[status] || { code: 500, message: "Unexpected error." };
        res.status(outcome.code).json({ success: status === "removed", status, message: outcome.message });
    } catch (err) {
        console.error("removeFriendController error:", err);
        res.status(500).json({ success: false, message: "Could not remove friend." });
    }
}

export async function getFriendsListController(req, res) {
    try {
        const cached = await getCachedFriendsList(req.user.id);
        if (cached) return res.json({ success: true, data: cached, cached: true });

        const friends = await socialModel.getFriendsList(req.user.id);
        await setCachedFriendsList(req.user.id, friends);
        res.json({ success: true, data: friends, cached: false });
    } catch (err) {
        console.error("getFriendsListController error:", err);
        res.status(500).json({ success: false, message: "Could not load friends list." });
    }
}

export async function getPendingRequestsController(req, res) {
    try {
        const direction = req.query.direction === "outgoing" ? "outgoing" : "incoming";
        const requests = await socialModel.getPendingRequests(req.user.id, direction);
        res.json({ success: true, data: requests });
    } catch (err) {
        console.error("getPendingRequestsController error:", err);
        res.status(500).json({ success: false, message: "Could not load pending requests." });
    }
}