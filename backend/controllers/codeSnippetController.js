
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

// Only accept fields explicitly permitted above.
const getSnippetData = (body = {}) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

const handleError = (res, error, message) => {
  console.error(message, error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Please check the code snippet information provided.",
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid code snippet information.",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this information already exists.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
};

const validateSnippetData = (data) => {
  const requiredTextFields = [
    "title",
    "description",
    "language",
    "code",
  ];

  for (const field of requiredTextFields) {
    if (
      data[field] !== undefined &&
      (typeof data[field] !== "string" || !data[field].trim())
    ) {
      return `${field} must contain valid text.`;
    }
  }

  if (
    data.category !== undefined &&
    typeof data.category !== "string"
  ) {
    return "Category must be text.";
  }

  if (
    data.status !== undefined &&
    !["draft", "published"].includes(data.status)
  ) {
    return "Invalid publication status.";
  }

  if (data.technologies !== undefined) {
    if (
      !Array.isArray(data.technologies) ||
      !data.technologies.every(
        (technology) => typeof technology === "string"
      )
    ) {
      return "Technologies must be an array of text values.";
    }
  }

  if (
    data.relatedProject !== undefined &&
    data.relatedProject !== null &&
    data.relatedProject !== "" &&
    !mongoose.isValidObjectId(data.relatedProject)
  ) {
    return "Invalid related project ID.";
  }

  return null;
};

// PUBLIC TO REGISTERED USERS: Get published snippets.
export const getCodeSnippets = async (req, res) => {
  try {
    const snippets = await CodeSnippet.find({
      status: "published",
    })
      .select("-__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: snippets.length,
      snippets,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Get code snippets error:"
    );
  }
};

// ADMIN: Get all snippets.
export const getAdminCodeSnippets = async (req, res) => {
  try {
    const snippets = await CodeSnippet.find()
      .populate("createdBy", "name email")
      .populate("relatedProject", "title slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: snippets.length,
      snippets,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Get admin code snippets error:"
    );
  }
};

// REGISTERED USERS: Get one published snippet.
// ADMINS: Can also retrieve draft snippets.
export const getCodeSnippetById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid code snippet ID.",
      });
    }

    const snippet = await CodeSnippet.findById(req.params.id)
      .populate("relatedProject", "title slug");

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: "Code snippet not found.",
      });
    }

    if (
      snippet.status !== "published" &&
      req.user.role !== "admin"
    ) {
      return res.status(404).json({
        success: false,
        message: "Code snippet not found.",
      });
    }

    return res.status(200).json({
      success: true,
      snippet,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Get code snippet error:"
    );
  }
};

// ADMIN: Create snippet.
export const createCodeSnippet = async (req, res) => {
  try {
    const snippetData = getSnippetData(req.body);

    const validationError = validateSnippetData(snippetData);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const requiredFields = [
      "title",
      "description",
      "language",
      "code",
    ];

    const missingField = requiredFields.some(
      (field) =>
        typeof snippetData[field] !== "string" ||
        !snippetData[field].trim()
    );

    if (missingField) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, language and code are required.",
      });
    }

    if (snippetData.relatedProject === "") {
      snippetData.relatedProject = null;
    }

    const snippet = await CodeSnippet.create({
      ...snippetData,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Code snippet created successfully.",
      snippet,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Create code snippet error:"
    );
  }
};

// ADMIN: Update snippet.
export const updateCodeSnippet = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid code snippet ID.",
      });
    }

    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: "Code snippet not found.",
      });
    }

    const updateData = getSnippetData(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields were provided for updating.",
      });
    }

    const validationError = validateSnippetData(updateData);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (updateData.relatedProject === "") {
      updateData.relatedProject = null;
    }

    Object.assign(snippet, updateData);

    await snippet.save();

    return res.status(200).json({
      success: true,
      message: "Code snippet updated successfully.",
      snippet,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Update code snippet error:"
    );
  }
};

// ADMIN: Delete snippet.
export const deleteCodeSnippet = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid code snippet ID.",
      });
    }

    const snippet = await CodeSnippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: "Code snippet not found.",
      });
    }

    await snippet.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Code snippet deleted successfully.",
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Delete code snippet error:"
    );
  }
};
