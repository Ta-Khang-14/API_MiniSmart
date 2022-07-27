const asyncHandle = require("../middleware/asynHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const User = require("../models/User");
const sendResponse = require("../helpers/sendResponse");

// @route [GET] /api/admin/user/
// @desc get list user
// @access private
const getUsers = asyncHandle(async (req, res, next) => {
    const users = await User.find({
        role: "user",
    });
    sendResponse(res, "Get list user successfully", {
        users,
    });
});

// @route [delete] /api/admin/user/delete/:id
// @desc ban user
// @access private
const banUserById = asyncHandle(async (req, res, next) => {
    const userId = req.params.id;

    if (!userId) {
        return next(new ErrorResponse("User Id not found", 404));
    }

    const user = await User.findOne({
        _id: userId,
        isActive: true,
    });
    if (!user) {
        return next(
            new ErrorResponse("User not found or User is not active", 404)
        );
    }

    user.isActive = false;
    await user.save();
    sendResponse(res, "Successfully banned user");
});

// @route [delete] /api/admin/user/delete/
// @desc ban users
// @access private
const banUsers = asyncHandle(async (req, res, next) => {
    let userIds = req.body.userIds;
    userIds = JSON.parse(userIds);

    await User.updateMany(
        {
            _id: { $in: userIds },
            isActive: true,
        },
        {
            isActive: false,
        }
    );
    sendResponse(res, "Successfully banned users");
});

// @route [put] /api/admin/user/activated/:id
// @desc ban user
// @access private
const activatedUser = asyncHandle(async (req, res, next) => {
    let userId = req.params.id;

    if (!userId) {
        return next(new ErrorResponse("User Id not found", 404));
    }

    const user = await User.findOne({
        _id: userId,
        isActive: false,
    });
    if (!user) {
        return next(
            new ErrorResponse(
                "User not found or User has already activated",
                404
            )
        );
    }

    user.isActive = true;
    await user.save();
    sendResponse(res, "Successfully user activation");
});

module.exports = {
    getUsers,
    banUserById,
    banUsers,
    activatedUser,
};
