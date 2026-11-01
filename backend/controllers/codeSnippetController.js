
import mongoose from "mongoose";
import CodeSnippet from "../models/CodeSnippet.js";

const allowedFields = [
  "title",
  "description",
  "category",
  "language",
  "code",
  "technologies",
  "relatedProject",
  "status",
];

const getSnippetData = (body) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

// Registered users: published snippets only
export const getCodeSnippets = async (req, res) => {
  try {
    const snippets = await CodeSnippet.find({ status: "published" })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: snippets.length,
      snippets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve code snippets",
    });
  }
};

// Admin: retrieve all snippets
export const getAdminCodeSnippets = async (req, res) => {
  try {
    const snippets = await CodeSnippet.find()
      .populate("createdBy", "name email")
      .populate("relatedProject", "title slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: snippets.length,
      snippets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve admin code snippets",
    });
  }
};

// Retrieve one snippet
export const getCodeSnippetById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid code snippet ID",
      });
    }

    const snippet = await CodeSnippet.findById(req.params.id)
      .populate("relatedProject", "title slug");

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: "Code snippet not found",
      });
    }

    // Draft snippets are only accessible to admins
    if (snippet.status !== "published" && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Code snippet not found",
      });
    }

    res.status(200).json({
      success: true,
      snippet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve code snippet",
    });
  }
};

// Admin: create snippet
export const createCodeSnippet = async (req, res) => {
  try {
    const snippetData = getSnippetData(req.body);

    if (
      !snippetData.title ||
      !snippetData.description ||
      !snippetData.language ||
      !snippetData.code
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description, language and code are required",
      });
    }

    const snippet = await CodeSnippet.create({
      ...snippetData,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Code snippet created successfully",
      snippet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create code snippet",
    });
  }
};

// Admin: update snippet
export const updateCodeSnippet = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid code snippet ID",
      });
    }

    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: "Code snippet not found",
      });
    }

    const updateData = getSnippetData(req.body);

    Object.assign(snippet, updateData);
    await snippet.save();

    res.status(200).json({
      success: true,
      message: "Code snippet updated successfully",
      snippet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update code snippet",
    });
  }
};

// Admin: delete snippet
export const deleteCodeSnippet = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid code snippet ID",
      });
    }

    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: "Code snippet not found",
      });
    }

    await snippet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Code snippet deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete code snippet",
    });
  }
};
