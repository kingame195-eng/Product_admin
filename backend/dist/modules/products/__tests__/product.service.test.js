"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = require("../product.service");
const product_model_1 = require("../product.model");
jest.mock("../product.model");
describe("ProductService", () => {
    let productService;
    beforeEach(() => {
        productService = new product_service_1.ProductService();
        jest.clearAllMocks();
    });
    describe("create", () => {
        it("should create a product successfully", async () => {
            const mockProduct = {
                name: "Test Product",
                sku: "TEST-001",
                price: 100,
                quantity: 10,
            };
            const mockSavedProduct = { _id: "123", ...mockProduct };
            product_model_1.Product.prototype.save.mockResolvedValue(mockSavedProduct);
            const result = await productService.create(mockProduct, "userId");
            expect(result).toEqual(mockSavedProduct);
            expect(product_model_1.Product.prototype.save).toHaveBeenCalled();
        });
    });
    describe("findAll", () => {
        it("should return paginated products", async () => {
            const mockProducts = [
                { _id: "1", name: "Product 1", price: 100 },
                { _id: "2", name: "Product 2", price: 200 },
            ];
            product_model_1.Product.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockProducts),
            });
            product_model_1.Product.countDocuments.mockResolvedValue(2);
            const result = await productService.findAll({ page: 1, limit: 10 });
            expect(result.data).toEqual(mockProducts);
            expect(result.pagination.total).toBe(2);
        });
    });
});
//# sourceMappingURL=product.service.test.js.map