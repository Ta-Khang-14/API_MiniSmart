const express = require("express");
const router = express.Router();
const { checkAdminPermission } = require("../middleware/checkPermission");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    deleteProducts,
} = require("../controllers/productController");
const { verifyAcessToken } = require("../middleware/verifyToken");

router.put("/:id", verifyAcessToken, checkAdminPermission, updateProductById);
router.delete(
    "/:id",
    verifyAcessToken,
    checkAdminPermission,
    deleteProductById
);
router.delete("/", verifyAcessToken, checkAdminPermission, deleteProducts);
router.post("/", verifyAcessToken, checkAdminPermission, createProduct);
router.get("/:id", getProductById);
router.get("/", getProducts);

module.exports = router;
