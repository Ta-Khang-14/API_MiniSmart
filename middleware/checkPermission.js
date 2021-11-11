const ErrorResponse = require("../helpers/ErrorResponse");
const checkAdminPermission = (req, res, next) => {
    let role = req.role;

    if (!role) {
        return next(new ErrorResponse("Missing role", 404));
    }

    if (role !== "admin" && role !== "user") {
        return next(new ErrorResponse("Permission denied", 401));
    }

    if (role !== "admin") {
        return next(new ErrorResponse("Permission denied", 401));
    }

    next();
};

module.exports = { checkAdminPermission };
