const express = require("express");
const router = express.Router();
const { checkAdminPermission } = require("../middleware/checkPermission");
const {
    getCategories,
    createCategory,
} = require("../controllers/categoryController");

const { verifyAcessToken } = require("../middleware/verifyToken");

router.post("/", verifyAcessToken, checkAdminPermission, createCategory);
router.get("/", getCategories);
module.exports = router;
