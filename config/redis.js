require("dotenv").config();
const redis = require("redis");
const redisClient = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_URL,
    {
        password: process.env.REDIS_PASSWORD,
    }
);

redisClient.on("connect", () => {
    console.log("Redis client connected");
});

redisClient.on("error", (error) => {
    console.log(error);
});

module.exports = redisClient;
