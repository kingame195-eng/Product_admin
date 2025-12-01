"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/product_admin";
        await mongoose_1.default.connect(mongoURI);
        console.log("✅ MongoDB connected successfully");
        console.log(`📊 Database: ${mongoose_1.default.connection.name}`);
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Graceful shutdown
process.on("SIGINT", async () => {
    await mongoose_1.default.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});
//# sourceMappingURL=database.js.map