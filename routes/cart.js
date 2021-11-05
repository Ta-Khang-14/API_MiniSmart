const express = require("express");
const router = express.Router();
const { verifyAcessToken } = require("../middleware/verifyToken");
const { getCart } = require("../controllers/cartController");
router.get("/", verifyAcessToken, getCart);

module.exports = router;
