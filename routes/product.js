const express = require("express");
const router = express.Router();
const { checkAdminPermission } = require("../middleware/checkPermission");
const {
    createProduct,
    getProducts,
    getProductById,
} = require("../controllers/productController");
const { verifyAcessToken } = require("../middleware/verifyToken");

router.post("/", verifyAcessToken, checkAdminPermission, createProduct);
router.get("/:id", getProductById);
router.get("/", getProducts);

module.exports = router;
