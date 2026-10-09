// server/src/config/redis.js
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisClient = createClient({
    url: REDIS_URL,
    // The local Redis server is 5.x (Windows), which predates the HELLO
    // command (added in Redis 6.0). node-redis defaults to RESP3 and sends
    // `HELLO 3` as its handshake, which that server rejects with
    // "ERR unknown command `HELLO`". Force RESP2 to skip the handshake.
    RESP: 2,
    socket: {
        connectTimeout: 5000,
        // Keep retrying forever, backing off up to 10s between attempts,
        // so Redis can be started (or restarted) after the API is up.
        reconnectStrategy: (retries) => Math.min(retries * 500, 10000),
    },
    // Redis is only a cache. While it's down, fail commands immediately
    // instead of queueing them, so requests fall back to the database
    // rather than hanging until Redis returns.
    disableOfflineQueue: true,
});

// Log state changes once, not one stack trace per retry.
let wasReady = false;
let warnedDown = false;

redisClient.on("ready", () => {
    wasReady = true;
    warnedDown = false;
    console.log(`Redis connected (${REDIS_URL})`);
});

redisClient.on("error", (err) => {
    if (warnedDown) return;
    warnedDown = true;
    console.warn(
        `Redis ${wasReady ? "connection lost" : "unavailable"} at ${REDIS_URL} ` +
        `(${err.message || err.code || err.name}). ` +
        "Caching is disabled; retrying in the background."
    );
});

// Don't await: the API must start even if Redis isn't running yet.
redisClient.connect().catch(() => {
    // Already reported by the "error" handler above.
});

export function isRedisReady() {
    return redisClient.isReady;
}

export default redisClient;
