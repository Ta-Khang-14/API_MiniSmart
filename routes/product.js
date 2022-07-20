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
    getProductByCategoryId,
} = require("../controllers/productController");
const { verifyAcessToken } = require("../middleware/verifyToken");
const queryResults = require("../middleware/documentProcess");

const multer = require("multer");
const storage = require("../helpers/cloudinaryStorage");
const uploadCloud = multer({ storage: storage("Product") });

const uploadFile = require("../middleware/uploadFile");
const Product = require("../models/Product");

router.put(
    "/:id",
    verifyAcessToken,
    checkAdminPermission,
    uploadCloud.array("newPictures", 10),
    uploadFile("newPictures"),
    updateProductById
);
router.delete(
    "/:id",
    verifyAcessToken,
    checkAdminPermission,
    deleteProductById
);
router.delete("/", verifyAcessToken, checkAdminPermission, deleteProducts);
router.post(
    "/",
    verifyAcessToken,
    checkAdminPermission,
    uploadCloud.array("pictures", 10),
    uploadFile("pictures"),
    createProduct
);
router.get("/:id", getProductById);
router.get("/category/:id", getProductByCategoryId);
router.get("/", queryResults(Product), getProducts);

module.exports = router;
