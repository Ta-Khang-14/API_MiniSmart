const asyncHandle = require("../middleware/asynHandle");
const bcrypt = require("bcrypt");
const Cart = require("../models/Cart");
const generateRefreshToken = require("../helpers/generateRefreshToken");
const generateResetCode = require("../helpers/generateResetCode");
const ErrorResponse = require("../helpers/ErrorResponse");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const sendResponse = require("../helpers/sendResponse");
const sendUesrMail = require("../helpers/sendMail");
const { use } = require("../routes/auth");
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
        isActive: false,
        password: hashPassword,
    });
    await newUser.save();

    const newCart = new Cart({
        user: newUser._id,
    });
    await newCart.save();

    // send mail
    const options = {
        email,
        subject: "Kích hoạt tài khoản!",
        message: "Kích vào đường link sau để kích hoạt tài khoản của bạn: ",
        link: process.env.CLIENT_URL + "/api/auth/confirm/" + newUser._id,
    };
    sendUesrMail(res, options, "Send active mail successfully");

    // Hidden send mail
    // sendResponse(res, "Register successfully!");
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

    // check active account
    if (!matchUser.isActive) {
        return next(
            new ErrorResponse(
                "User is not activated or User has been banned",
                400
            )
        );
    }

    // check password
    const result = await bcrypt.compare(password, matchUser.password);
    if (!result) {
        return next(new ErrorResponse("Invalid email or password"), 400);
    }

    // all good
    const accessToken = jwt.sign(
        { userId: matchUser._id, role: matchUser.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    );
    const refreshToken = generateRefreshToken(matchUser._id, next);

    sendResponse(res, "Login successfully", {
        refreshToken,
        accessToken,
    });
});
// @route [GET] /api/auth/confirm/:id
// @desc user confirm email
// @access private
const confirmEmail = asyncHandle(async (req, res, next) => {
    const userId = req.params.id;

    // validate id
    if (!userId) {
        return next(new ErrorResponse("Invalid id", 400));
    }

    // check user
    const matchUer = await User.findById(userId);
    if (!matchUer) {
        return next(new ErrorResponse("User not found", 404));
    }

    // check active
    if (matchUer.isActive) {
        return next(new ErrorResponse("User was active", 400));
    }

    // all good
    matchUer.isActive = true;
    // const newCart = new Cart({
    //     user: matchUer._id,
    // });
    await matchUer.save();

    res.redirect("https://minimart-demo.netlify.app/");
    // sendResponse(res, "Active account successfully");
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
    const { name, surname, email, phone } = req.body;
    const updateInfomation = { name, surname, email, phone };
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
    sendResponse(res, "Update informtion successfully", { user: matchUser });
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
// @route [POST] /api/auth/forget-password
// @desc user forget password
// @access public
const forgetPassword = asyncHandle(async (req, res, next) => {
    const { email } = req.body;

    //validate email
    if (!email) {
        return next(new ErrorResponse("Missing information!", 400));
    }

    // chech user
    const matchUser = await User.findOne({ email });
    if (!matchUser) {
        return next(new ErrorResponse("User not found", 404));
    }

    //generate reset code
    const resetCode = generateResetCode(matchUser._id, next);

    // all good
    const options = {
        email,
        subject: "Quên mật khẩu",
        message: `Mã của bạn: ${resetCode}. Mã tồn tại trong 15 phút.`,
    };

    sendUesrMail(res, options, {
        message: "Send reset code successfully",
    });
});

// @route [POST] /api/auth/reset-password
// @desc user reset password
// @access public
const resetPassword = asyncHandle(async (req, res, next) => {
    const { resetPassword, confirmResetPassword } = req.body;
    const userId = req.userId;
    console.log(userId);

    // validate resetPassword && confirmResetPassword
    if (!resetPassword || !confirmResetPassword) {
        return next(new ErrorResponse("Missing information", 400));
    }
    if (resetPassword !== confirmResetPassword) {
        return next(
            new ErrorResponse(
                "Reset password not match with confirm password",
                400
            )
        );
    }

    // check user
    const matchUser = await User.findById(userId);
    if (!matchUser) {
        return next(new ErrorResponse("User not found", 404));
    }

    // hashpassword
    const hashPassword = await bcrypt.hash(resetPassword, saltRounds);

    //reset password
    matchUser.password = hashPassword;
    await matchUser.save();

    //all good
    sendResponse(res, "Reset password successfully");
});

// @route [GET] /api/auth/
// @desc get user's information
// @access private
const getInfor = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    // simple userID
    if (!userId) {
        return next(new ErrorResponse("User ID not found", 404));
    }

    // get infor
    const user = await User.findOne({ _id: userId }).select([
        "-password",
        "-isActive",
        "-createdAt",
        "-updatedAt",
    ]);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }
    console.log(user);
    // all good
    sendResponse(res, "Get user's information successfully!", { user });
});
module.exports = {
    register,
    login,
    changePassword,
    updateInfor,
    getAccessToken,
    forgetPassword,
    resetPassword,
    confirmEmail,
    getInfor,
};
