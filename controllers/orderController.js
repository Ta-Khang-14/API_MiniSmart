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
        orders = await Order.find();
    } else if (role === "user") {
        orders = await Order.find({ user: userId });
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
    let order = await Order.findById({ _id: orderId });

    if (!order) {
        return next(new ErrorResponse("Order not found", 404));
    }

    sendResponse(res, "Get order by id successfully", { order });
});

// @route [POST] /api/orders/
// @desc create order
// @access private
const createOrder = asyncHandle(async (req, res, next) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    // const options = { session };
    // console.log(options);
    // return next(new Error());
    const userId = req.userId;
    const {
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

    // create order
    const newOrder = new Order({
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

    // upload products
    // const matchProducts = await Product.find({ _id: { $in: products } });

    // let inforProduct = {};
    // products.forEach((element, index) => {
    //     let i = matchProducts.indexOf({ _id: element });
    //     console.log(i);
    //     inforProduct[element] = quantity[index] + matchProducts[i].quantity;
    // });
    // console.log(matchProducts);
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
