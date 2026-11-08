
import express from "express";

import {
  getPublicServices,
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: Get published services
router.get("/", getPublicServices);

// Admin: Get all services
router.get("/admin/all", protect, adminOnly, getAllServices);

// Admin: Create service
router.post("/", protect, adminOnly, createService);

// Admin: Update service
router.put("/:id", protect, adminOnly, updateService);

// Admin: Delete service
router.delete("/:id", protect, adminOnly, deleteService);

export default router;
