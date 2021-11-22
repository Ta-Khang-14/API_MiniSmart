const express = require("express");
const router = express.Router();
const { verifyAcessToken } = require("../middleware/verifyToken");

const {
    createAddress,
    getAddress,
    updateAddressInfor,
    deleteAddress,
} = require("../controllers/addressController");

router.put("/:addressId", verifyAcessToken, updateAddressInfor);
router.delete("/:addressId", verifyAcessToken, deleteAddress);

router.post("/", verifyAcessToken, createAddress);
router.get("/", verifyAcessToken, getAddress);

module.exports = router;
