const cloudinary = require("../config/cloudinary");
const asyncHandle = require("../middleware/asynHandle");

const deleteImage = asyncHandle(async (req, res, next) => {
    if (req.destroy) {
        await cloudinary.uploader.destroy(req.destroy[1]);
    }
    next();
});
module.exports = deleteImage;
