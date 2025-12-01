"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const product_validation_1 = require("./product.validation");
const router = (0, express_1.Router)();
const productController = new product_controller_1.ProductController();
router.use(auth_middleware_1.authMiddleware);
// Place specific routes BEFORE parametric routes
router.get("/stats", productController.getStats);
router.post("/bulk-delete", productController.bulkDelete);
// Parametric routes AFTER specific routes
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", (0, validation_middleware_1.validateRequest)(product_validation_1.productValidation.create), productController.create);
router.put("/:id", (0, validation_middleware_1.validateRequest)(product_validation_1.productValidation.update), productController.update);
router.delete("/:id", productController.delete);
exports.default = router;
//# sourceMappingURL=product.routes.js.map