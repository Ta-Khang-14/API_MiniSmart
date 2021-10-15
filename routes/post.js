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

router.put("/:id", verifyAcessToken, checkAdminPermission, updatePostById);
router.delete("/:id", verifyAcessToken, checkAdminPermission, deletePostById);
router.get("/:id", getPostById);

router.post("/", verifyAcessToken, checkAdminPermission, createPost);
router.get("/", getPosts);

module.exports = router;
