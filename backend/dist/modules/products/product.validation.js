"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.productValidation = {
    create: joi_1.default.object({
        name: joi_1.default.string().required().min(3).max(255),
        slug: joi_1.default.string()
            .lowercase()
            .pattern(/^[a-z0-9-]+$/),
        sku: joi_1.default.string().required().uppercase(),
        description: joi_1.default.string().allow(""),
        shortDescription: joi_1.default.string().max(500),
        price: joi_1.default.number().required().min(0),
        salePrice: joi_1.default.number().min(0).less(joi_1.default.ref("price")),
        costPrice: joi_1.default.number().min(0),
        quantity: joi_1.default.number().integer().min(0).default(0),
        categoryId: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/),
        brand: joi_1.default.string(),
        weight: joi_1.default.number().min(0),
        dimensions: joi_1.default.object({
            length: joi_1.default.number().min(0),
            width: joi_1.default.number().min(0),
            height: joi_1.default.number().min(0),
        }),
        images: joi_1.default.array().items(joi_1.default.string().uri()),
        thumbnail: joi_1.default.string().uri(),
        status: joi_1.default.string().valid("draft", "published", "archived"),
        isFeatured: joi_1.default.boolean(),
        seo: joi_1.default.object({
            metaTitle: joi_1.default.string().max(255),
            metaDescription: joi_1.default.string().max(500),
            metaKeywords: joi_1.default.string(),
        }),
    }),
    update: joi_1.default.object({
        name: joi_1.default.string().min(3).max(255),
        slug: joi_1.default.string()
            .lowercase()
            .pattern(/^[a-z0-9-]+$/),
        sku: joi_1.default.string().uppercase(),
        description: joi_1.default.string().allow(""),
        shortDescription: joi_1.default.string().max(500),
        price: joi_1.default.number().min(0),
        salePrice: joi_1.default.number().min(0).less(joi_1.default.ref("price")),
        costPrice: joi_1.default.number().min(0),
        quantity: joi_1.default.number().integer().min(0),
        categoryId: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/),
        brand: joi_1.default.string(),
        weight: joi_1.default.number().min(0),
        dimensions: joi_1.default.object({
            length: joi_1.default.number().min(0),
            width: joi_1.default.number().min(0),
            height: joi_1.default.number().min(0),
        }),
        images: joi_1.default.array().items(joi_1.default.string().uri()),
        thumbnail: joi_1.default.string().uri(),
        status: joi_1.default.string().valid("draft", "published", "archived"),
        isFeatured: joi_1.default.boolean(),
        seo: joi_1.default.object({
            metaTitle: joi_1.default.string().max(255),
            metaDescription: joi_1.default.string().max(500),
            metaKeywords: joi_1.default.string(),
        }),
    }).min(1),
};
//# sourceMappingURL=product.validation.js.map