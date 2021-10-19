const asyncHandle = require("../middleware/asynHandle");
const Product = require("../models/Product");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");

// @route [POST] /api/products/
// @desc create a new product
// @access private
const createProduct = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const {
        title,
        description,
        pictures,
        price,
        discount,
        quantity,
        country,
        unit,
        category,
    } = req.body;

    // validate input
    if (!userId) {
        return next(new ErrorResponse("Id not found", 404));
    }

    if (
        !title ||
        !description ||
        !price ||
        !quantity ||
        !country ||
        !category
    ) {
        return next(new ErrorResponse("Missing information", 400));
    }

    // check title
    const oldProduct = await Product.findOne({ title });
    if (oldProduct) {
        return next(new ErrorResponse("Title has taken", 400));
    }

    //  all good
    const newProduct = new Product({
        title,
        description,
        pictures,
        price,
        discount,
        quantity,
        country,
        unit,
        postBy: userId,
        category,
    });

    await newProduct.save();
    sendResponse(res, "Create new product successfully", {
        product: newProduct,
    });
});

// @route [GET] /api/products/
// @desc get list products
// @access public
const getProducts = asyncHandle(async (req, res, next) => {
    const products = await Product.find();

    if (!products) {
        return next(new ErrorResponse("Products not found", 404));
    }

    sendResponse(res, "Get list products successfully", { products });
});
// @route [GET] /api/products/:id
// @desc get product by id
// @access public
const getProductById = asyncHandle(async (req, res, next) => {
    const productId = req.params.id;

    if (!productId) {
        return next(new ErrorResponse("Product ID not found", 404));
    }
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    sendResponse(res, "Get product by id successfully", { product });
});
// @route [PUT] /api/products/:id
// @desc get product by id
// @access public
module.exports = { createProduct, getProducts, getProductById };
