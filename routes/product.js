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

const multer = require("multer");
const storage = require("../helpers/cloudinaryStorage");
const uploadCloud = multer({ storage: storage("Product") });
const uploadFile = require("../middleware/uploadFile");

router.put(
    "/:id",
    verifyAcessToken,
    checkAdminPermission,
    uploadCloud.array("pictures", 10),
    uploadFile,
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
    uploadFile,
    createProduct
);
router.get("/:id", getProductById);
router.get("/", getProducts);

module.exports = router;
