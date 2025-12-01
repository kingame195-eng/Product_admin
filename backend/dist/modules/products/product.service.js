"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = require("./product.model");
class ProductService {
    async create(data, userId) {
        const product = new product_model_1.Product({
            ...data,
            createdBy: userId,
            updatedBy: userId,
        });
        return await product.save();
    }
    async findAll(filter) {
        const { page = 1, limit = 10, search, categoryId, status, minPrice, maxPrice, sortBy = "createdAt", sortOrder = "desc", } = filter;
        const query = {};
        // Search
        if (search) {
            query.$text = { $search: search };
        }
        // Filters
        if (categoryId)
            query.categoryId = categoryId;
        if (status)
            query.status = status;
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined)
                query.price.$gte = minPrice;
            if (maxPrice !== undefined)
                query.price.$lte = maxPrice;
        }
        // Pagination
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
        const [products, total] = await Promise.all([
            product_model_1.Product.find(query)
                .populate("categoryId", "name slug")
                .populate("createdBy", "fullName email")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            product_model_1.Product.countDocuments(query),
        ]);
        return {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findById(id) {
        return await product_model_1.Product.findById(id)
            .populate("categoryId")
            .populate("createdBy", "fullName email");
    }
    async update(id, data, userId) {
        return await product_model_1.Product.findByIdAndUpdate(id, { ...data, updatedBy: userId }, { new: true, runValidators: true });
    }
    async delete(id) {
        const result = await product_model_1.Product.findByIdAndDelete(id);
        return !!result;
    }
    async updateStock(id, quantity) {
        return await product_model_1.Product.findByIdAndUpdate(id, { $inc: { quantity } }, { new: true });
    }
    async bulkDelete(ids) {
        const result = await product_model_1.Product.deleteMany({ _id: { $in: ids } });
        return result.deletedCount || 0;
    }
    async getStats() {
        const stats = await product_model_1.Product.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                },
            },
        ]);
        const lowStock = await product_model_1.Product.countDocuments({ quantity: { $lt: 10 } });
        const outOfStock = await product_model_1.Product.countDocuments({ quantity: 0 });
        return {
            byStatus: stats,
            lowStock,
            outOfStock,
        };
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map