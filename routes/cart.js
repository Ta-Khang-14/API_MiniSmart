const express = require("express");
const router = express.Router();
const { verifyAcessToken } = require("../middleware/verifyToken");
const {
    getCart,
    addProduct,
    updateProductInCart,
    deleteProductFromCartById,
    deleteProductsFromCart,
} = require("../controllers/cartController");

router.put(
    "/delete-product/:productId",
    verifyAcessToken,
    deleteProductFromCartById
);
router.put("/delete-product/", verifyAcessToken, deleteProductsFromCart);

router.put("/update-product/:productId", verifyAcessToken, updateProductInCart);

router.put("/add", verifyAcessToken, addProduct);

router.get("/", verifyAcessToken, getCart);

module.exports = router;
