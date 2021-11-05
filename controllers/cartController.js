const asyncHandle = require("../middleware/asynHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");
const Cart = require("../models/Cart");

// @route [GET] /api/cart/
// @desc get user cart
// @access private
const getCart = asyncHandle(async (req, res, next) => {
    const userId = req.userId;

    // simple validate userID
    if (!userId) {
        return next(new ErrorResponse("User ID not found", 404));
    }

    // Find cart
    let matchCart = await Cart.findOne({ user: userId });
    if (!matchCart) {
        return next("Cart not found or User is not active", 404);
    }

    // all good
    sendResponse(res, "Get cart successfully", { cart: matchCart });
});

// @route [PUT] /api/cart/add
// @desc get user cart
// @access private
const addProduct = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const { productId, quantity = 1 } = req.body;

    // simple validate userID
    if (!userId) {
        return next(new ErrorResponse("User ID not found", 404));
    }

    // simple validate input
    if (!productId) {
        return next(new ErrorResponse("Product ID not found", 404));
    }
});
module.exports = { getCart };
