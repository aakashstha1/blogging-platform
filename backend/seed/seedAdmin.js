import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../modules/users/user.model.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    });

    const existingAdmin = await User.findOne({
      $or: [{ username: "admin" }, { email: "admin@gmail.com" }],
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const passwordWithPepper = "Admin@123" + process.env.PEPPER;

    const hashedPassword = await bcrypt.hash(passwordWithPepper, 10);

    await User.create({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
