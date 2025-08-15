const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    seedAdmin();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Seed admin user
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ username: "admin" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    await User.create({
      username: "admin",
      name: "Admin User",
      password: "password",
      role: "ADMIN",
    });

    console.log("Admin user created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin user:", err);
    process.exit(1);
  }
};
