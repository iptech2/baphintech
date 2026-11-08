import express from "express";

import {
  getPublicSettings,
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public settings
router.get("/", getPublicSettings);

// Admin settings
router.get("/admin", protect, adminOnly, getSettings);
router.put("/admin", protect, adminOnly, updateSettings);

export default router;