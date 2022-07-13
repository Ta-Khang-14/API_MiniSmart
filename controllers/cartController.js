const asyncHandle = require("../middleware/asynHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");
const Cart = require("../models/Cart");
const { find } = require("../models/Cart");
const Product = require("../models/Product");

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
    const matchCart = await Cart.findOne({ user: userId }).populate("products");
    if (!matchCart) {
        return next("Cart not found or User is not active", 404);
    }
    // all good
    sendResponse(res, "Get cart successfully", { cart: matchCart });
});

// @route [PUT] /api/cart/add
// @desc add product to cart
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

    // find product
    const matchProduct = await Product.findOne({
        _id: productId,
        isDeleted: false,
    });

    if (!matchProduct) {
        return next(new ErrorResponse("Product not found", 404));
    }

    // find cart
    let matchCart = await Cart.findOne({ user: userId });
    if (!matchCart) {
        return next(new ErrorResponse("User not found", 404));
    }
    // get list product id
    let listProductIds = matchCart.products.map((item) =>
        item._id.toHexString()
    );
    // add product
    if (listProductIds.indexOf(productId) === -1) {
        matchCart.products.push(productId);
        matchCart.quantity.push(quantity);
    } else {
        matchCart.quantity[listProductIds.indexOf(productId)] += +quantity;
    }

    await matchCart.save();
    matchCart = await matchCart.populate("products");
    //await matchCart;
    sendResponse(res, "Add product successfully", { cart: matchCart });
});

// @route [PUT] /api/cart/update-product/:productId
// @desc update product in cart
// @access private
const updateProductInCart = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const { quantity } = req.body;
    const productId = req.params.productId;

    // simple validate userID
    if (!userId) {
        return next(new ErrorResponse("User ID not found", 404));
    }

    // simple validate input
    if (!productId || !quantity) {
        return next(new ErrorResponse("Missing information", 404));
    }

    // find product
    const matchProduct = await Product.findById(productId);
    if (!matchProduct) {
        return next(new ErrorResponse("Product not found", 404));
    }

    // find cart
    const matchCart = await Cart.findOne({ user: userId }).populate("products");
    if (!matchCart) {
        return next(new ErrorResponse("User not found", 404));
    }

    // get list product id
    let listProductIds = matchCart.products.map((item) =>
        item._id.toHexString()
    );

    matchCart.quantity[listProductIds.indexOf(productId)] = quantity;
    await matchCart.save();

    sendResponse(res, "Update product in Cart successfully", {
        cart: matchCart,
    });
});

// @route [PUT] /api/cart/delete-product/:productId
// @desc delete product from cart
// @access private
const deleteProductFromCartById = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const productId = req.params.productId;

    // simple validate userID
    if (!userId) {
        return next(new ErrorResponse("User ID not found", 404));
    }

    // simple validate input
    if (!productId) {
        return next(new ErrorResponse("Missing information", 404));
    }

    // find product
    const matchProduct = await Product.findById(productId);
    if (!matchProduct) {
        return next(new ErrorResponse("Product not found", 404));
    }

    // find cart
    const matchCart = await Cart.findOne({ user: userId }).populate("products");
    if (!matchCart) {
        return next(new ErrorResponse("User not found", 404));
    }

    // get list product id
    let listProductIds = matchCart.products.map((item) =>
        item._id.toHexString()
    );
    let index = listProductIds.indexOf(productId);

    matchCart.products.splice(index, 1);
    matchCart.quantity.splice(index, 1);
    await matchCart.save();

    sendResponse(res, "Delete product form cart by ID successfully!", {
        cart: matchCart,
    });
});

// @route [PUT] /api/cart/delete-product/
// @desc delete products from cart
// @access private
const deleteProductsFromCart = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    let { productIds = [] } = req.body;
    productIds = JSON.parse(productIds);
    // simple validate userID
    if (!userId) {
        return next(new ErrorResponse("User ID not found", 404));
    }

    // find cart
    const matchCart = await Cart.findOne({ user: userId }).populate("products");
    if (!matchCart) {
        return next(new ErrorResponse("User not found", 404));
    }

    // delete products
    let listProductIds = matchCart.products.map((item) =>
        item._id.toHexString()
    );

    for (let i = 0; i < productIds.length; i++) {
        let index = listProductIds.indexOf(productIds[i]);
        while (index !== -1) {
            matchCart.products.splice(index, 1);
            matchCart.quantity.splice(index, 1);
            listProductIds.splice(index, 1);
            index = listProductIds.indexOf(productIds[i]);
        }
    }
    await matchCart.save();

    sendResponse(res, "Delete products form cart successfully", {
        cart: matchCart,
    });
});
module.exports = {
    getCart,
    addProduct,
    updateProductInCart,
    deleteProductFromCartById,
    deleteProductsFromCart,
};
