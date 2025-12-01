import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";
import productRoutes from "./modules/products/product.routes";
import authRoutes from "./modules/auth/auth.routes";
import categoryRoutes from "./modules/categories/category.routes";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("uploads"));

const API_PREFIX = process.env.API_PREFIX || "/api/v1";
console.log("[DEBUG] API_PREFIX:", API_PREFIX);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);

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
app.use(errorHandler);
export default app;
