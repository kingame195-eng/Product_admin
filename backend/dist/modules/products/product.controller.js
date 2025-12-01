"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const error_util_1 = require("../../utils/error.util");
class ProductController {
    constructor() {
        this.create = async (req, res, next) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    throw new Error("User not authenticated");
                }
                const product = await this.productService.create(req.body, userId);
                res.status(201).json({
                    success: true,
                    message: "Product created successfully",
                    data: product,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAll = async (req, res, next) => {
            try {
                const result = await this.productService.findAll(req.query);
                res.status(200).json({
                    success: true,
                    ...result,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const product = await this.productService.findById(req.params.id);
                if (!product) {
                    throw new error_util_1.AppError("Product not found", 404);
                }
                res.status(200).json({
                    success: true,
                    data: product,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    throw new Error("User not authenticated");
                }
                const product = await this.productService.update(req.params.id, req.body, userId);
                if (!product) {
                    throw new error_util_1.AppError("Product not found", 404);
                }
                res.status(200).json({
                    success: true,
                    message: "Product updated successfully",
                    data: product,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const success = await this.productService.delete(req.params.id);
                if (!success) {
                    throw new error_util_1.AppError("Product not found", 404);
                }
                res.status(200).json({
                    success: true,
                    message: "Product deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.bulkDelete = async (req, res, next) => {
            try {
                const { ids } = req.body;
                const deletedCount = await this.productService.bulkDelete(ids);
                res.status(200).json({
                    success: true,
                    message: `${deletedCount} products deleted successfully`,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getStats = async (_req, res, next) => {
            try {
                const stats = await this.productService.getStats();
                res.status(200).json({
                    success: true,
                    data: stats,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.productService = new product_service_1.ProductService();
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map