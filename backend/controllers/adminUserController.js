
import mongoose from "mongoose";
import User from "../models/User.js";

// ESCAPE REGEX SPECIAL CHARACTERS
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;

    const filter = {};

    if (["user", "admin"].includes(role)) {
      filter.role = role;
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    if (search?.trim()) {
      const searchTerm = escapeRegex(search.trim());

      filter.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      admins,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ role: "admin" }),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        admins,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve users.",
    });
  }
};

// UPDATE USER STATUS
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "A valid account status is required.",
      });
    }

    if (id === req.user._id.toString() && !isActive) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent deactivating the last active administrator.
    if (!isActive && user.role === "admin" && user.isActive) {
      const activeAdmins = await User.countDocuments({
        role: "admin",
        isActive: true,
      });

      if (activeAdmins <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot deactivate the last active administrator.",
        });
      }
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user status.",
    });
  }
};

// UPDATE USER ROLE
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    if (id === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own administrator role.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent demoting the last active administrator.
    if (
      role !== "admin" &&
      user.role === "admin" &&
      user.isActive
    ) {
      const activeAdmins = await User.countDocuments({
        role: "admin",
        isActive: true,
      });

      if (activeAdmins <= 1) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot demote the last active administrator.",
        });
      }
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user role.",
    });
  }
};
