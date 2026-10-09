// server/src/services/Social_services/socialCache.service.js
import redisClient, { isRedisReady } from "../../config/redis.js";

const FRIENDS_LIST_TTL_SECONDS = 300;   // 5 min
const PROFILE_TTL_SECONDS = 120;        // 2 min

// Redis is only a cache: if it's down or a command fails, behave like a
// cache miss (reads) or a no-op (writes) so the request falls back to the
// database instead of failing.
async function safely(operation, fallback) {
    if (!isRedisReady()) return fallback;
    try {
        return await operation();
    } catch (err) {
        console.warn("Redis cache operation failed:", err.message);
        return fallback;
    }
}

export async function getCachedFriendsList(userId) {
    const cached = await safely(() => redisClient.get(`friends:${userId}`), null);
    return cached ? JSON.parse(cached) : null;
}

export async function setCachedFriendsList(userId, friends) {
    await safely(() => redisClient.setEx(`friends:${userId}`, FRIENDS_LIST_TTL_SECONDS, JSON.stringify(friends)));
}

export async function invalidateFriendsList(userId) {
    await safely(() => redisClient.del(`friends:${userId}`));
}

export async function getCachedProfile(userId, viewerId) {
    const cached = await safely(() => redisClient.get(`profile:${userId}:viewedBy:${viewerId}`), null);
    return cached ? JSON.parse(cached) : null;
}

export async function setCachedProfile(userId, viewerId, profile) {
    await safely(() => redisClient.setEx(`profile:${userId}:viewedBy:${viewerId}`, PROFILE_TTL_SECONDS, JSON.stringify(profile)));
}

export async function invalidateProfile(userId) {
    // Wildcard delete: all cached views of this profile, by any viewer
    await safely(async () => {
        const keys = await redisClient.keys(`profile:${userId}:viewedBy:*`);
        if (keys.length) await redisClient.del(keys);
    });
}
