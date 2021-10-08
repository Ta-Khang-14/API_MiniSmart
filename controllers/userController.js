const asyncHandle = require("../middleware/asynHandle");
const bcrypt = require("bcrypt");
const generateRefreshToken = require("../helpers/generateRefreshToken");
const ErrorResponse = require("../helpers/ErrorResponse");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const sendResponse = require("../helpers/sendResponse");
const { findByIdAndUpdate } = require("../models/User");
const saltRounds = 10;

// @route [POST] /api/auth/register
// @desc user register
// @access Public
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
        { userId: newUser._id, role: newUser.role },
        process.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = generateRefreshToken(newUser._id, next);

    sendResponse(res, "Create new user successfully", {
        refreshToken,
        accessToken,
    });
});
// @route [POST] /api/auth/login
// @desc user login
// @access Public
const login = asyncHandle(async (req, res, next) => {
    const { email, password } = req.body;

    // simple validate
    if (!email || !password) {
        return next(new ErrorResponse("Missing information", 400));
    }

    // check email
    const matchUser = await User.findOne({ email });
    if (!matchUser) {
        return next(new ErrorResponse("Invalid email or password"), 400);
    }

    // check password
    const result = await bcrypt.compare(password, matchUser.password);
    if (!result) {
        return next(new ErrorResponse("Invalid email or password"), 400);
    }

    // all good
    const accessToken = jwt.sign(
        { userId: matchUser._id, role: matchUser.role },
        process.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = generateRefreshToken(matchUser._id, next);

    sendResponse(res, "Login successfully", {
        refreshToken,
        accessToken,
    });
});
// @route [PUT] /api/auth/change-password
// @desc user change password
// @access private
const changePassword = asyncHandle(async (req, res, next) => {
    const { password, newPassword, confirmNewPassword } = req.body;
    const userId = req.userId;

    // simple validate
    if (!password || !newPassword || !confirmNewPassword) {
        return next(new ErrorResponse("Missing information", 400));
    }

    // compare newPassword vs confirmNewPassword
    if (newPassword !== confirmNewPassword) {
        return next(
            new ErrorResponse(
                "New password not match with confirm password",
                400
            )
        );
    }

    // check user
    const matchUser = await User.findById(userId);
    if (!matchUser) {
        return next(new ErrorResponse("User not found", 404));
    }

    // check password
    const result = await bcrypt.compare(password, matchUser.password);
    if (!result) {
        return next(new ErrorResponse("Invalid password", 400));
    }

    // hash new password
    const newHashPassword = await bcrypt.hash(newPassword, saltRounds);
    // all good
    const updatedUser = await User.findByIdAndUpdate(userId, {
        password: newHashPassword,
    });

    sendResponse(res, "Change password successfully");
});
// @route [PUT] /api/auth/
// @desc user update infor
// @access private
const updateInfor = asyncHandle(async (req, res, next) => {
    const updateInfomation = { ...req.body };
    const userId = req.userId;

    // validate infor
    Object.keys(updateInfomation).forEach((key) => {
        if (!updateInfomation[key]) {
            delete updateInfomation[key];
        }
    });

    // check user
    const matchUser = await User.findById(userId).select("-password");
    if (!matchUser) {
        return next(new ErrorResponse("User not found", 404));
    }

    //check email
    if (updateInfomation.email && updateInfomation.email !== matchUser.email) {
        const existEmail = await User.findOne({
            email: updateInfomation.email,
        });

        if (existEmail) {
            return next(new ErrorResponse("Email already exists"));
        }
    }

    // all good
    Object.keys(updateInfomation).forEach((key) => {
        matchUser[key] = updateInfomation[key];
    });
    await matchUser.save();

    console.log(matchUser);
    sendResponse(res, "Update informtion successfully", matchUser);
});
// @route [POST] /api/auth/access-token
// @desc user update infor
// @access private
const getAccessToken = asyncHandle(async (req, res, next) => {
    const userId = req.userId;

    // check user
    const matchUser = await User.findById(userId);
    if (!matchUser) {
        return next(new ErrorResponse("User not found", 404));
    }

    // generate access token
    const accessToken = jwt.sign(
        { userId: matchUser._id, role: matchUser.role },
        process.env.ACCESS_TOKEN_SECRET
    );

    // all good
    sendResponse(res, "Create new access token successfully", { accessToken });
});

module.exports = {
    register,
    login,
    changePassword,
    updateInfor,
    getAccessToken,
};
