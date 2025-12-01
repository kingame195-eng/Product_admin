"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_util_1 = require("../utils/error.util");
const errorHandler = (err, _req, res, _next) => {
    console.error("[ERROR HANDLER]", err);
    if (err instanceof error_util_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
    }
    // Custom validation error from Joi
    if (err.name === "ValidationError" && err.details) {
        return res.status(400).json({
            success: false,
            message: err.message,
            errors: err.details,
        });
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: err.message,
        });
    }
    // Mongoose duplicate key error
    if (err.name === "MongoServerError" && err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate field value entered",
        });
    }
    // Default error
    console.error("ERROR 💥", err);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map