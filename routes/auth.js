const express = require("express");
const router = express.Router();
const {
    verifyAcessToken,
    verifyRefreshToken,
} = require("../middleware/verifyToken");

const {
    register,
    login,
    changePassword,
    updateInfor,
    getAccessToken,
} = require("../controllers/userController");

router.put("/change-password", verifyAcessToken, changePassword);
router.post("/access-token", verifyRefreshToken, getAccessToken);

router.post("/register", register);
router.post("/login", login);

router.put("/", verifyAcessToken, updateInfor);

module.exports = router;
