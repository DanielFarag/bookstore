import redis from "redis";
import "dotenv/config";

export const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.connect().catch(console.error);
