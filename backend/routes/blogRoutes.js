
import express from "express";

import {
  getPublishedBlogs,
  getBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin routes
router.get("/admin/all", protect, adminOnly, getAdminBlogs);
router.post("/", protect, adminOnly, createBlog);
router.put("/:id", protect, adminOnly, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

// Public routes
router.get("/", getPublishedBlogs);
router.get("/:slug", getBlogBySlug);

export default router;
