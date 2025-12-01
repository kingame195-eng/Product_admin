"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_model_1 = require("./category.model");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get("/", async (_req, res, next) => {
    try {
        const categories = await category_model_1.Category.find({ isActive: true }).sort({
            name: 1,
        });
        res.json({ success: true, data: categories });
    }
    catch (error) {
        next(error);
    }
});
router.post("/", async (req, res, next) => {
    try {
        const category = await category_model_1.Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=category.routes.js.map