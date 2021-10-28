const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = (folder) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: `MiniMart//${folder}`,
            format: async (req, file) => "png",
        },
    });
};

module.exports = storage;
