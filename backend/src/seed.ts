import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./modules/users/user.model";

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/product_admin"
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Create admin user
    await User.create({
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
      const hashedPwd = await bcrypt.hash(userData.password, 12);
      await User.create({
        ...userData,
        password: hashedPwd,
      });
      console.log(`✅ Created ${userData.role} user: ${userData.email}`);
    }

    console.log("\n🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
