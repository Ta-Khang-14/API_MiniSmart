const asyncHandle = require("../middleware/asynHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");
const Cart = require("../models/Cart");
const { find } = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const sendUesrMail = require("../helpers/sendMail");
const mongoose = require("mongoose");

// @route [GET] /api/orders/
// @desc get orders
// @access private
const getOrders = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const role = req.role;

    // simple validate userID
    if (!userId) {
        return next(new ErrorResponse("User ID not found", 404));
    }

    // get order
    let orders;
    if (role === "admin") {
        orders = await Order.find().populate("products");
    } else if (role === "user") {
        orders = await Order.find({ user: userId }).populate("products");
    }

    if (!orders) {
        return next(new ErrorResponse("Orders not found", 404));
    }

    sendResponse(res, "Get orders successfully", { orders });
});

// @route [GET] /api/orders/:orderId
// @desc get order by id
// @access private
const getOrderById = asyncHandle(async (req, res, next) => {
    const orderId = req.params.orderId;
    const userId = req.userId;

    // simple validate userID
    if (!orderId) {
        return next(new ErrorResponse("Order ID not found", 404));
    }

    // get order
    let order = await Order.findById({ _id: orderId }).populate("products");

    if (!order) {
        return next(new ErrorResponse("Order not found", 404));
    }

    sendResponse(res, "Get order by id successfully", { order });
});

// @route [POST] /api/orders/
// @desc create order
// @access private
const createOrder = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    let {
        name,
        email,
        address = "",
        note = "",
        products,
        city,
        quantity,
        district,
        sumMoney,
        status,
    } = req.body;

    // simple validate input
    if (
        !name ||
        !email ||
        !products ||
        !city ||
        !district ||
        !sumMoney ||
        !quantity
    ) {
        return next(new ErrorResponse("Missing information", 400));
    }
    //format products id and quantity
    if (typeof products == "string") {
        products = JSON.parse(products);
    }
    if (typeof quantity == "string") {
        quantity = JSON.parse(quantity);
    }

    if (products.length != quantity.length) {
        return next(new ErrorResponse("Invalid input data", 400));
    }
    // create order
    let newOrder = new Order({
        user: userId,
        name,
        email,
        address,
        note,
        products,
        quantity,
        city,
        district,
        sumMoney,
        status,
    });

    await newOrder.save();
    newOrder = await newOrder.populate("products");

    // upload products
    const matchProducts = await Product.find({ _id: { $in: products } });

    // get list product id
    let listProducts = matchProducts.map((value) => value._id.toHexString());

    await Promise.all(
        products.map((value, index) => {
            let i = listProducts.indexOf(value._id.toHexString());
            matchProducts[i].sellNumber += +quantity[index];
            return matchProducts[i].save();
        })
    );

    sendResponse(res, "Create order successfully", { order: newOrder });
});

// @route [PUT] /api/orders/change-status/:orderId
// @desc change status order
// @access private
const changeStatusOrder = asyncHandle(async (req, res, next) => {
    const orderId = req.params.orderId;
    const { status } = req.body;

    // simple validate userID
    if (!orderId) {
        return next(new ErrorResponse("Order ID not found", 404));
    }

    // simple validate userID
    if (!["Chờ xác nhận", "Chờ lấy hàng", "Đã thanh toán"].includes(status)) {
        return next(new ErrorResponse("Invalid status", 404));
    }

    // find order
    const order = await Order.findByIdAndUpdate(
        orderId,
        {
            status,
        },
        { new: true }
    );

    sendResponse(res, "Change order's status successfully!", { order });
});
module.exports = { getOrders, getOrderById, createOrder, changeStatusOrder };
