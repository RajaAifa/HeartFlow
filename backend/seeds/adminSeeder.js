import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.log("❌ MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env");
      process.exit(1);
    }

    const email = ADMIN_EMAIL.trim();

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    const existingAdmin = await adminModel.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists. No action taken.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await adminModel.create({
      email,
      password: hashedPassword,
    });

    console.log("🎉 Admin created successfully:");
    console.log({
      id: admin._id,
      email: admin.email,
    });

    process.exit(0);
  } catch (error) {
    console.log("❌ Seeder error:", error.message);
    process.exit(1);
  }
};

createAdmin();