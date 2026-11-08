import express from "express";

import {
  getPublicWebsiteContent,
  getAllWebsiteContent,
  createWebsiteContent,
  updateWebsiteContent,
  deleteWebsiteContent,
} from "../controllers/websiteContentController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getPublicWebsiteContent);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllWebsiteContent);
router.post("/", protect, adminOnly, createWebsiteContent);
router.put("/:id", protect, adminOnly, updateWebsiteContent);
router.delete("/:id", protect, adminOnly, deleteWebsiteContent);

export default router;