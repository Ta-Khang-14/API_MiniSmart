const express = require("express");
const router = express.Router();
const { verifyAcessToken } = require("../middleware/verifyToken");
const { checkAdminPermission } = require("../middleware/checkPermission");
const {
    createPost,
    getPosts,
    getPostById,
    updatePostById,
    deletePostById,
} = require("../controllers/postController");

const multer = require("multer");
const storage = require("../helpers/cloudinaryStorage");
const uploadCloud = multer({ storage: storage("Product") });
const uploadFile = require("../middleware/uploadFile");

router.put(
    "/:id",
    verifyAcessToken,
    checkAdminPermission,
    uploadCloud.array("newPictures", 10),
    uploadFile("newPictures"),
    updatePostById
);
router.delete("/:id", verifyAcessToken, checkAdminPermission, deletePostById);
router.get("/:id", getPostById);

router.post(
    "/",
    verifyAcessToken,
    checkAdminPermission,
    uploadCloud.array("pictures", 10),
    uploadFile("pictures"),
    createPost
);
router.get("/", getPosts);

module.exports = router;
