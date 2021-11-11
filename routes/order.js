const express = require("express");
const router = express.Router();
const { verifyAcessToken } = require("../middleware/verifyToken");

const {
    getOrderById,
    getOrders,
    createOrder,
    changeStatusOrder,
} = require("../controllers/orderController");

router.put("/change-status/:orderId", verifyAcessToken, changeStatusOrder);

router.get("/:orderId", verifyAcessToken, getOrderById);

router.post("/", verifyAcessToken, createOrder);
router.get("/", verifyAcessToken, getOrders);

module.exports = router;
