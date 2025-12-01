"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
const loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});
const registerSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
    fullName: joi_1.default.string().min(2).required().messages({
        "string.min": "Full name must be at least 2 characters",
        "any.required": "Full name is required",
    }),
});
router.post("/register", (0, validation_middleware_1.validateRequest)(registerSchema), authController.register);
router.post("/login", (0, validation_middleware_1.validateRequest)(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.get("/me", auth_middleware_1.authMiddleware, authController.getMe);
console.log("Auth routes loaded");
exports.default = router;
//# sourceMappingURL=auth.routes.js.map