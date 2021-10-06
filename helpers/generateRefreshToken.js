require("dotenv").config();
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const ErrorResponse = require("./ErrorResponse");

const generateRefreshToken = (userId, next) => {
    // create refreshToken
    const refreshToken = jwt.sign(
        { userId: userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        }
    );

    // save refreshToken
    redisClient.set(userId.toString(), refreshToken, (err) => {
        if (err) {
            return next(new ErrorResponse(err.message, 400));
        }
        console.log("Stored refreshToken");
    });

    return refreshToken;
};

module.exports = generateRefreshToken;
