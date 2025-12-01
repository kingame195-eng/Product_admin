"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const PORT = process.env.PORT || 5001;
// Check required environment variables
function checkEnvironment() {
    const requiredEnvs = ["JWT_SECRET", "JWT_REFRESH_SECRET", "MONGO_URI"];
    const missing = requiredEnvs.filter((env) => !process.env[env]);
    if (missing.length > 0) {
        console.error("❌ Missing required environment variables:", missing.join(", "));
        process.exit(1);
    }
    console.log("✅ All required environment variables are set");
}
const connectDB = async () => {
    try {
        console.log("[DB] Connecting to MongoDB...");
        console.log("[DB] MONGO_URI:", process.env.MONGO_URI);
        // Sử dụng MONGO_URI từ .env
        await mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://localhost:27017/product_admin");
        console.log("✅ MongoDB connected successfully");
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
const startServer = async () => {
    checkEnvironment();
    await connectDB();
    const server = app_1.default.listen(PORT, () => {
        console.log(`\n🚀 Server running on port ${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV}`);
        console.log(`📊 API Prefix: ${process.env.API_PREFIX}\n`);
    });
    server.on("error", (error) => {
        console.error("❌ Server error:", error);
        process.exit(1);
    });
};
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, closing server...");
    await mongoose_1.default.connection.close();
    process.exit(0);
});
process.on("uncaughtException", (error) => {
    console.error("❌ UNCAUGHT EXCEPTION:", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ UNHANDLED REJECTION at:", promise, "reason:", reason);
});
startServer();
//# sourceMappingURL=server.js.map