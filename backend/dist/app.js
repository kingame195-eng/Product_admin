"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middlewares/error.middleware");
const product_routes_1 = __importDefault(require("./modules/products/product.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const category_routes_1 = __importDefault(require("./modules/categories/category.routes"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || "*" }));
// Logging
app.use((0, morgan_1.default)("dev"));
// Body parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files
app.use("/uploads", express_1.default.static("uploads"));
const API_PREFIX = process.env.API_PREFIX || "/api/v1";
console.log("[DEBUG] API_PREFIX:", API_PREFIX);
app.use(`${API_PREFIX}/auth`, auth_routes_1.default);
app.use(`${API_PREFIX}/products`, product_routes_1.default);
app.use(`${API_PREFIX}/categories`, category_routes_1.default);
// Health check
app.get(`${API_PREFIX}/health`, (_req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// Test route
app.post("/test-login", (_req, res) => {
    res.json({ message: "Test endpoint works" });
});
// Friendly root route
app.get("/", (_req, res) => {
    res.send("Backend API is running!");
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// Error handler (must be last)
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map