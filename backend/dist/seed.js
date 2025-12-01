"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("./modules/users/user.model");
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://localhost:27017/product_admin");
        console.log("✅ Connected to MongoDB");
        // Clear existing users
        await user_model_1.User.deleteMany({});
        console.log("🗑️  Cleared existing users");
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash("admin123", 12);
        // Create admin user
        await user_model_1.User.create({
            email: "admin@example.com",
            password: hashedPassword,
            fullName: "Admin User",
            role: "admin",
            isActive: true,
        });
        console.log("✅ Admin user created:");
        console.log("   Email: admin@example.com");
        console.log("   Password: admin123");
        console.log("   Role: admin");
        // Create test users
        const testUsers = [
            {
                email: "manager@example.com",
                password: "manager123",
                fullName: "Manager User",
                role: "manager",
                isActive: true,
            },
            {
                email: "staff@example.com",
                password: "staff123",
                fullName: "Staff User",
                role: "staff",
                isActive: true,
            },
            {
                email: "user@example.com",
                password: "user123",
                fullName: "Regular User",
                role: "user",
                isActive: true,
            },
        ];
        for (const userData of testUsers) {
            const hashedPwd = await bcryptjs_1.default.hash(userData.password, 12);
            await user_model_1.User.create({
                ...userData,
                password: hashedPwd,
            });
            console.log(`✅ Created ${userData.role} user: ${userData.email}`);
        }
        console.log("\n🎉 Database seeded successfully!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}
seedDatabase();
//# sourceMappingURL=seed.js.map