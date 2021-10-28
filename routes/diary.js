const express = require("express");
const router = express.Router();
const {
    getDiaries,
    getDiaryById,
    getDiaryByProductId,
} = require("../controllers/diaryController");

const { checkAdminPermission } = require("../middleware/checkPermission");
const { verifyAcessToken } = require("../middleware/verifyToken");

router.get(
    "/product/:id",
    verifyAcessToken,
    checkAdminPermission,
    getDiaryByProductId
);
router.get("/:id", verifyAcessToken, checkAdminPermission, getDiaryById);
router.get("/", verifyAcessToken, checkAdminPermission, getDiaries);

module.exports = router;
