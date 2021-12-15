const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middleware/asynHandle");

const uploadFile = (name) => (req, res, next) => {
    if (!req.files) {
        return next();
    } else {
        const arrayUrl = req.files.map((item) => item.path);
        req[name] = [...arrayUrl];
        next();
    }
};

module.exports = uploadFile;
