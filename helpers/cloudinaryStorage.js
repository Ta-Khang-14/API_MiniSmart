const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = (folder) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: `MiniMart//${folder}`,
            allowedFormats: ["jpg", "png"],
        },
    });
};

module.exports = storage;
