const ErrorResponse = require("../helpers/ErrorResponse");

const errHandle = (err, req, res, next) => {
    console.log(`Error Handle: ${err.message}`);
    console.log(err);
    let error = { ...err };

    error.code = err.code || null;
    error.message = err.message;

    // MongoDB bad ObjectID
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // MongoDB validation failed
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((error) => error.message);
        error = new ErrorResponse(message, 400);
    }

    // MongoDB duplicate value
    if (err.code === 11000) {
        const message = "Duplicate value";
        error = new ErrorResponse(message, 400);
    }

    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        error_code: error.code || "Unknown code error",
    });
};
module.exports = errHandle;
