process.env.JWT_SECRET = "testsecret";
process.env.JWT_REFRESH_SECRET = "testrefreshsecret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";

import request from "supertest";
import app from "../../../app";
import mongoose from "mongoose";
import { User } from "../../users/user.model";
import bcrypt from "bcryptjs";
import { Product } from "../product.model";

// Utility to connect/disconnect test DB (adjust as needed)
beforeAll(async () => {
  // Connect to test DB (use a test URI or memory server)
  await mongoose.connect(
    "mongodb://localhost:27017/product_admin_test?authSource=admin",
    {
      user: "admin",
      pass: "admin123",
    }
  );
  // Create a test user for authentication (hash password to match AuthService)
  const hashedPassword = await bcrypt.hash("password123", 12);
  await User.create({
    email: "admin@test.com",
    password: hashedPassword,
    fullName: "Admin Test",
    role: "admin",
    isActive: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Product API Integration Tests", () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "admin@test.com",
      password: "password123", // Should match the pre-hashed password
    });
    authToken =
      loginResponse.body.data?.accessToken || loginResponse.body.accessToken;
  });

  afterEach(async () => {
    await Product.deleteMany({});
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

      const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.name).toBe(newProduct.name);
    });

    it("should return 401 without auth token", async () => {
      await request(app).post("/api/v1/products").send({}).expect(401);
    });
  });

  describe("GET /api/v1/products", () => {
    it("should return paginated products", async () => {
      // Insert a product first
      await Product.create({
        name: "Product 1",
        slug: "product-1",
        sku: "SKU-001",
        price: 100,
        quantity: 5,
        status: "published",
        images: [],
        isFeatured: false,
      });

      const response = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toHaveProperty("total");
    });
  });
});
