
import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  getCodeSnippets,
  getAdminCodeSnippets,
  getCodeSnippetById,
  createCodeSnippet,
  updateCodeSnippet,
  deleteCodeSnippet,
} from "../controllers/codeSnippetController.js";

const router = express.Router();

// Admin routes
router.get("/admin/all", protect, adminOnly, getAdminCodeSnippets);
router.post("/", protect, adminOnly, createCodeSnippet);
router.put("/:id", protect, adminOnly, updateCodeSnippet);
router.delete("/:id", protect, adminOnly, deleteCodeSnippet);

// Registered users
router.get("/", protect, getCodeSnippets);
router.get("/:id", protect, getCodeSnippetById);

export default router;
