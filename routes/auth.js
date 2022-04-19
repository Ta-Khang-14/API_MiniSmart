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
    confirmEmail,
    getInfor,
} = require("../controllers/userController");

const passport = require("../middleware/passport");

// router.get(
//     "/google",
//     passport.authenticate("google", { scope: ["profile", "email"] })
// );
// router.get("/google/callback", passport.authenticate("google"));

router.get("/confirm/:id", confirmEmail);

router.put("/change-password", verifyAcessToken, changePassword);
router.post("/access-token", verifyRefreshToken, getAccessToken);
router.post("/reset-password", verifyResetToken, resetPassword);
router.post("/forget-password", forgetPassword);

router.post("/register", register);
router.post("/login", login);

router.put("/", verifyAcessToken, updateInfor);
router.get("/", verifyAcessToken, getInfor);

module.exports = router;
