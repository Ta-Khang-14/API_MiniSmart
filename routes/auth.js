const express = require("express");
const router = express.Router();
const { verifyAcessToken } = require("../middleware/verifyToken");

const {
    register,
    login,
    changePassword,
} = require("../controllers/userController");

router.put("/change-password", verifyAcessToken, changePassword);

router.post("/register", register);
router.post("/login", login);

module.exports = router;
