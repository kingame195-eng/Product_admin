"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../users/user.model");
const error_util_1 = require("../../utils/error.util");
class AuthService {
    async register(data) {
        const existingUser = await user_model_1.User.findOne({ email: data.email });
        if (existingUser) {
            throw new error_util_1.AppError("Email already exists", 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        const user = await user_model_1.User.create({
            ...data,
            password: hashedPassword,
        });
        const tokens = this.generateTokens({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        return { user, tokens };
    }
    async login(email, password) {
        try {
            console.log("[AuthService.login] Starting login for:", email);
            // Find user and explicitly include password
            let user = await user_model_1.User.findOne({ email }).select("+password");
            console.log("[AuthService.login] User found:", user ? "yes" : "no");
            if (!user) {
                throw new error_util_1.AppError("Invalid credentials", 401);
            }
            if (!user.isActive) {
                throw new error_util_1.AppError("User account is inactive", 401);
            }
            console.log("[AuthService.login] Comparing passwords...");
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            console.log("[AuthService.login] Password valid:", isPasswordValid);
            if (!isPasswordValid) {
                throw new error_util_1.AppError("Invalid credentials", 401);
            }
            // Convert to object and remove password
            const userObj = user.toObject();
            delete userObj.password;
            const tokens = this.generateTokens({
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            });
            return { user: userObj, ...tokens };
        }
        catch (error) {
            console.error("[AuthService.login] Error:", error);
            throw error;
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await user_model_1.User.findById(decoded.id);
            if (!user || !user.isActive) {
                throw new error_util_1.AppError("Invalid refresh token", 401);
            }
            return this.generateTokens({
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            });
        }
        catch (error) {
            throw new error_util_1.AppError("Invalid refresh token", 401);
        }
    }
    async getUserById(userId) {
        const user = await user_model_1.User.findById(userId).select("-password");
        if (!user || !user.isActive) {
            throw new error_util_1.AppError("User not found", 404);
        }
        return user;
    }
    generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
        return { accessToken, refreshToken };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map