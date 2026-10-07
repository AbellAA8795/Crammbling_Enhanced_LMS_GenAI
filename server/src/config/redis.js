// server/src/config/redis.js
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    // The local Redis server is 5.x (Windows), which predates the HELLO
    // command (added in Redis 6.0). node-redis defaults to RESP3 and sends
    // `HELLO 3` as its handshake, which that server rejects with
    // "ERR unknown command `HELLO`". Force RESP2 to skip the handshake.
    RESP: 2,
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
await redisClient.connect();

export default redisClient;