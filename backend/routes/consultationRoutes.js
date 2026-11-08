
import express from "express";

import {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
} from "../controllers/consultationController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public consultation request
router.post("/", createConsultation);

// Admin consultation management
router.get("/admin/all", protect, adminOnly, getAllConsultations);
router.get("/admin/:id", protect, adminOnly, getConsultationById);
router.patch("/admin/:id", protect, adminOnly, updateConsultation);
router.delete("/admin/:id", protect, adminOnly, deleteConsultation);

export default router;
