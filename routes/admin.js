const express = require("express");
const router = express.Router();
const {
    banUserById,
    banUsers,
    activatedUser,
    getUsers,
} = require("../controllers/adminController");

const { checkAdminPermission } = require("../middleware/checkPermission");
const { verifyAcessToken } = require("../middleware/verifyToken");

router.get("/user/", verifyAcessToken, checkAdminPermission, getUsers);

router.delete(
    "/user/delete/:id",
    verifyAcessToken,
    checkAdminPermission,
    banUserById
);

router.delete(
    "/user/delete/",
    verifyAcessToken,
    checkAdminPermission,
    banUsers
);

router.put(
    "/user/activated/:id",
    verifyAcessToken,
    checkAdminPermission,
    activatedUser
);
module.exports = router;
