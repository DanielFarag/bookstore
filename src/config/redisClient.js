import redis from "redis";
import "dotenv/config";
import config from "./config.js";


export const redisClient = redis.createClient(config.redis);

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("ready", () => {
  console.log(`Redis Client Connected ${config.redis.url}`);
});

redisClient.connect().catch(console.error);
