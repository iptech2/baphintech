
import express from "express";

import {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "../controllers/messageController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public contact form
router.post("/", createMessage);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllMessages);
router.get("/admin/:id", protect, adminOnly, getMessageById);
router.patch("/admin/:id", protect, adminOnly, updateMessage);
router.delete("/admin/:id", protect, adminOnly, deleteMessage);

export default router;
