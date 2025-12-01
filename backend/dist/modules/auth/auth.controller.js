"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    constructor() {
        this.register = async (req, res, next) => {
            try {
                const result = await this.authService.register(req.body);
                res.status(201).json({
                    success: true,
                    message: "User registered successfully",
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                console.log("[LOGIN] Request received with email:", email);
                if (!email || !password) {
                    res.status(400).json({
                        success: false,
                        message: "Email and password are required",
                    });
                    return; // ← Thêm return statement
                }
                const result = await this.authService.login(email, password);
                console.log("[LOGIN] Success, sending response");
                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    data: result,
                });
            }
            catch (error) {
                console.error("[LOGIN] Error caught:", error);
                next(error);
            }
        };
        this.refreshToken = async (req, res, next) => {
            try {
                const { refreshToken } = req.body;
                const tokens = await this.authService.refreshToken(refreshToken);
                res.status(200).json({
                    success: true,
                    data: tokens,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMe = async (req, res, next) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    throw new Error("User not authenticated");
                }
                const user = await this.authService.getUserById(userId);
                res.status(200).json({
                    success: true,
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map