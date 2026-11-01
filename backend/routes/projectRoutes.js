
import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  getPublicProjects,
  getAdminProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// Public project previews
router.get("/", getPublicProjects);

// Admin project management
router.get("/admin/all", protect, adminOnly, getAdminProjects);
router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

// Full details require login
router.get("/:id", protect, getProjectById);

export default router;
