require("dotenv").config();
const ErrorResponse = require("./ErrorResponse");
const randomstring = require("randomstring");
const redisClient = require("../config/redis");

const generateResetCode = (userId, next) => {
    const resetCode = randomstring.generate({
        length: 6,
        charset: "alphanumeric",
        capitalization: "uppercase",
    });

    redisClient.set(
        resetCode,
        userId.toString(),
        "EX",
        process.env.RESET_CODE_EXPIRE,
        (err) => {
            if (err) {
                return next(new ErrorResponse(err.message, 500));
            }
            console.log("Generated reset code");
        }
    );

    return resetCode;
};

module.exports = generateResetCode;
