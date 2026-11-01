
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } =
      process.env;

    if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env"
      );
    }

    if (ADMIN_PASSWORD.length < 6) {
      throw new Error("Admin password must be at least 6 characters.");
    }

    await mongoose.connect(MONGO_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    let user = await User.findOne({ email }).select("+password");

    if (user) {
      user.name = ADMIN_NAME?.trim() || user.name;
      user.password = hashedPassword;
      user.role = "admin";
      user.isActive = true;

      await user.save();

      console.log("Existing account updated successfully.");
    } else {
      await User.create({
        name: ADMIN_NAME?.trim() || "Baphin Tech Admin",
        email,
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });

      console.log("Admin account created successfully.");
    }

    console.log("Admin email:", email);
    console.log("Admin role: admin");
    console.log("You can now log in using the password in backend/.env");
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

createAdmin();
