const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../helpers/cloudinaryStorage");
const uploadCloud = multer({ storage: storage("Product") });

router.post("/cloudinary", uploadCloud.array("files", 10), (req, res, next) => {
    if (!req.files) {
        next(new Error("No file uploaded!"));
        return;
    }
    const arrayUrl = req.files.map((item) => item.path);
    res.json({ secure_url: arrayUrl });
});

module.exports = router;
