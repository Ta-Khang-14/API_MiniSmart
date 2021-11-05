const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middleware/asynHandle");

const uploadFile = (req, res, next) => {
    // console.log(req.files);
    if (!req.files) {
        return next();
    } else {
        const arrayUrl = req.files.map((item) => item.path);
        req.pictures = [...arrayUrl];
        // console.log(req.pictures);
        next();
    }
};

module.exports = uploadFile;
