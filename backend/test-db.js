const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI =
  process.env.MONGODB_URI ||
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("✅ Connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  });
