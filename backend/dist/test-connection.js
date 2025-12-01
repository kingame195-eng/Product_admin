"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./modules/users/user.model");
async function testConnection() {
    try {
        console.log("[TEST] Connecting to MongoDB...");
        console.log("[TEST] MONGO_URI:", process.env.MONGO_URI);
        await mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://localhost:27017/product_admin");
        console.log("✅ Connected to MongoDB successfully!");
        // Check if users exist
        const userCount = await user_model_1.User.countDocuments();
        console.log(`[TEST] Total users in database: ${userCount}`);
        if (userCount === 0) {
            console.log("⚠️  No users found! Run: npm run seed");
        }
        else {
            const users = await user_model_1.User.find().select("-password");
            console.log("[TEST] Users in database:");
            users.forEach((user) => {
                console.log(`  - ${user.email} (${user.role})`);
            });
        }
        // Test user with password field
        const adminUser = await user_model_1.User.findOne({ email: "admin@example.com" }).select("+password");
        if (adminUser) {
            console.log("✅ Admin user found with password field");
        }
        else {
            console.log("❌ Admin user not found!");
        }
        await mongoose_1.default.connection.close();
        console.log("\n✅ Test completed successfully!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Test failed:", error.message);
        if (error.message.includes("authentication") ||
            error.message.includes("Authentication")) {
            console.error("\n🔴 AUTHENTICATION ERROR!");
            console.error("MongoDB requires authentication but .env has no credentials.\n");
            console.error("Try one of these fixes:\n");
            console.error("1️⃣  Option A: Update .env with credentials:");
            console.error("   MONGO_URI=mongodb://admin:password@localhost:27017/product_admin?authSource=admin\n");
            console.error("2️⃣  Option B: Use Docker MongoDB (no auth needed):");
            console.error("   docker run -d -p 27017:27017 --name mongodb mongo:latest\n");
            console.error("3️⃣  Option C: Connect without auth (if MongoDB allows):");
            console.error("   mongod --bind_ip 127.0.0.1 (restart MongoDB)\n");
        }
        process.exit(1);
    }
}
testConnection();
//# sourceMappingURL=test-connection.js.map