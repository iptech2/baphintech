
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const validEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (phone !== undefined && typeof phone !== "string") {
      return res.status(400).json({
        success: false,
        message: "Phone number must be valid text.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone?.trim() || "";

    if (normalizedName.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 5 characters.",
      });
    }

    if (!validEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    if (password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password is too long.",
      });
    }

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    if (normalizedPhone) {
      const existingPhone = await User.findOne({
        phone: normalizedPhone,
      });

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "An account with this phone number already exists.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return res.status(409).json({
        success: false,
        message:
          duplicateField === "phone"
            ? "An account with this phone number already exists."
            : "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
};

// GET CURRENT AUTHENTICATED USER
export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user information.",
    });
  }
};
