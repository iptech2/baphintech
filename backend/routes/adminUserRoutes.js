
import express from "express";

import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
} from "../controllers/adminUserController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes require administrator authentication
router.use(protect, adminOnly);

// GET all users
router.get("/", getAllUsers);

// UPDATE account status
router.patch("/:id/status", updateUserStatus);

// UPDATE user role
router.patch("/:id/role", updateUserRole);

export default router;
