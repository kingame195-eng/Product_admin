"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.JWT_SECRET = "testsecret";
process.env.JWT_REFRESH_SECRET = "testrefreshsecret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../../users/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const product_model_1 = require("../product.model");
// Utility to connect/disconnect test DB (adjust as needed)
beforeAll(async () => {
    // Connect to test DB (use a test URI or memory server)
    await mongoose_1.default.connect("mongodb://localhost:27017/product_admin_test?authSource=admin", {
        user: "admin",
        pass: "admin123",
    });
    // Create a test user for authentication (hash password to match AuthService)
    const hashedPassword = await bcryptjs_1.default.hash("password123", 12);
    await user_model_1.User.create({
        email: "admin@test.com",
        password: hashedPassword,
        fullName: "Admin Test",
        role: "admin",
        isActive: true,
    });
});
afterAll(async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
});
describe("Product API Integration Tests", () => {
    let authToken;
    beforeAll(async () => {
        // Login to get auth token
        const loginResponse = await (0, supertest_1.default)(app_1.default).post("/api/v1/auth/login").send({
            email: "admin@test.com",
            password: "password123", // Should match the pre-hashed password
        });
        authToken =
            loginResponse.body.data?.accessToken || loginResponse.body.accessToken;
    });
    afterEach(async () => {
        await product_model_1.Product.deleteMany({});
    });
    describe("POST /api/v1/products", () => {
        it("should create a new product", async () => {
            const newProduct = {
                name: "Test Product",
                slug: "test-product",
                sku: "TEST-001",
                price: 100,
                quantity: 10,
                status: "draft",
                images: [],
                isFeatured: false,
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .send(newProduct)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("_id");
            expect(response.body.data.name).toBe(newProduct.name);
        });
        it("should return 401 without auth token", async () => {
            await (0, supertest_1.default)(app_1.default).post("/api/v1/products").send({}).expect(401);
        });
    });
    describe("GET /api/v1/products", () => {
        it("should return paginated products", async () => {
            // Insert a product first
            await product_model_1.Product.create({
                name: "Product 1",
                slug: "product-1",
                sku: "SKU-001",
                price: 100,
                quantity: 5,
                status: "published",
                images: [],
                isFeatured: false,
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/api/v1/products")
                .set("Authorization", `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.pagination).toHaveProperty("total");
        });
    });
});
//# sourceMappingURL=product.integration.test.js.map