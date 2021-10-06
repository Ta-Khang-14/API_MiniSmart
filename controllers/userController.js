const asyncHandle = require("../middleware/asynHandle");
const bcrypt = require("bcrypt");
const generateRefreshToken = require("../helpers/generateRefreshToken");
const ErrorResponse = require("../helpers/ErrorResponse");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const sendResponse = require("../helpers/sendResponse");
const saltRounds = 10;

const register = asyncHandle(async (req, res, next) => {
    const { name, surname, phone = "", email, password } = req.body;

    // simple validate
    if (!name || !surname || !email || !password) {
        return next(new ErrorResponse("Missing information", 400));
    }

    //Check email exist
    let matchUser = await User.findOne({ email });
    if (matchUser) {
        return next(new ErrorResponse("Email already exists", 400));
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // create new user
    const newUser = new User({
        name,
        surname,
        phone,
        email,
        password: hashPassword,
        role: "user",
    });
    await newUser.save();

    // create token
    const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = generateRefreshToken(newUser._id);

    sendResponse(res, "Create new user successfully", {
        refreshToken,
        accessToken,
    });
});

module.exports = { register };
