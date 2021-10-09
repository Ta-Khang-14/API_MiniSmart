const express = require("express");
const router = express.Router();
const {
    verifyAcessToken,
    verifyRefreshToken,
    verifyResetToken,
} = require("../middleware/verifyToken");

const {
    register,
    login,
    changePassword,
    updateInfor,
    getAccessToken,
    forgetPassword,
    resetPassword,
} = require("../controllers/userController");

router.put("/change-password", verifyAcessToken, changePassword);
router.post("/access-token", verifyRefreshToken, getAccessToken);
router.post("/reset-password", verifyResetToken, resetPassword);
router.post("/forget-password", forgetPassword);

router.post("/register", register);
router.post("/login", login);

router.put("/", verifyAcessToken, updateInfor);

module.exports = router;
