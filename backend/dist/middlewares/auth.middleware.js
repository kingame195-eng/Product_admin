"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_util_1 = require("../utils/error.util");
const authMiddleware = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token) {
            console.log("[AUTH] No token provided");
            throw new error_util_1.AppError("Access token is required", 401);
        }
        console.log("[AUTH] Verifying token...");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("[AUTH] Token verified for user:", decoded.email);
        next();
    }
    catch (error) {
        console.log("[AUTH] Error:", error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new error_util_1.AppError("Token expired", 401));
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new error_util_1.AppError("Invalid token", 401));
        }
        else {
            next(error);
        }
    }
};
exports.authMiddleware = authMiddleware;
const authorize = (...roles) => {
    return (req, _res, next) => {
        try {
            if (!req.user || !roles.includes(req.user.role)) {
                throw new error_util_1.AppError("Insufficient permissions", 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map