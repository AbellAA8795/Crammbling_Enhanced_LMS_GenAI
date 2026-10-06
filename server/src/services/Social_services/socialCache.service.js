// server/src/services/Social_services/socialCache.service.js
import redisClient from "../../config/redis.js";

const FRIENDS_LIST_TTL_SECONDS = 300;   // 5 min
const PROFILE_TTL_SECONDS = 120;        // 2 min

export async function getCachedFriendsList(userId) {
    const cached = await redisClient.get(`friends:${userId}`);
    return cached ? JSON.parse(cached) : null;
}

export async function setCachedFriendsList(userId, friends) {
    await redisClient.setEx(`friends:${userId}`, FRIENDS_LIST_TTL_SECONDS, JSON.stringify(friends));
}

export async function invalidateFriendsList(userId) {
    await redisClient.del(`friends:${userId}`);
}

export async function getCachedProfile(userId, viewerId) {
    const cached = await redisClient.get(`profile:${userId}:viewedBy:${viewerId}`);
    return cached ? JSON.parse(cached) : null;
}

export async function setCachedProfile(userId, viewerId, profile) {
    await redisClient.setEx(`profile:${userId}:viewedBy:${viewerId}`, PROFILE_TTL_SECONDS, JSON.stringify(profile));
}

export async function invalidateProfile(userId) {
    // Wildcard delete: all cached views of this profile, by any viewer
    const keys = await redisClient.keys(`profile:${userId}:viewedBy:*`);
    if (keys.length) await redisClient.del(keys);
}