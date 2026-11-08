
import mongoose from "mongoose";
import WebsiteContent from "../models/WebsiteContent.js";

const allowedFields = [
  "section",
  "title",
  "subtitle",
  "description",
  "image",
  "buttonText",
  "buttonLink",
  "content",
];

const textFields = [
  "section",
  "title",
  "subtitle",
  "description",
  "image",
  "buttonText",
  "buttonLink",
];

const handleContentError = (error, res, fallbackMessage) => {
  console.error(fallbackMessage, error);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A website section with this name already exists.",
    });
  }

  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

const validateContentFields = (data) => {
  for (const field of textFields) {
    if (
      data[field] !== undefined &&
      typeof data[field] !== "string"
    ) {
      return `${field} must be valid text.`;
    }
  }

  if (
    data.content !== undefined &&
    (
      data.content === null ||
      typeof data.content !== "object" ||
      Array.isArray(data.content)
    )
  ) {
    return "Content must be a valid object.";
  }

  return null;
};

const getAllowedData = (body = {}) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

// PUBLIC: Get website content
export const getPublicWebsiteContent = async (req, res) => {
  try {
    const content = await WebsiteContent.find().sort({
      section: 1,
    });

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    return handleContentError(
      error,
      res,
      "Failed to fetch website content."
    );
  }
};

// ADMIN: Get all website content
export const getAllWebsiteContent = async (req, res) => {
  try {
    const content = await WebsiteContent.find()
      .populate("updatedBy", "name email")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    return handleContentError(
      error,
      res,
      "Failed to fetch website content."
    );
  }
};

// ADMIN: Create website content
export const createWebsiteContent = async (req, res) => {
  try {
    const data = getAllowedData(req.body);

    if (
      typeof data.section !== "string" ||
      !data.section.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Section is required.",
      });
    }

    const validationError = validateContentFields(data);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    data.section = data.section.trim();

    const existingContent = await WebsiteContent.findOne({
      section: data.section,
    });

    if (existingContent) {
      return res.status(409).json({
        success: false,
        message: "This website section already exists.",
      });
    }

    const newContent = await WebsiteContent.create({
      ...data,
      content: data.content || {},
      updatedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Website content created successfully.",
      content: newContent,
    });
  } catch (error) {
    return handleContentError(
      error,
      res,
      "Failed to create website content."
    );
  }
};

// ADMIN: Update website content
export const updateWebsiteContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID.",
      });
    }

    const updates = getAllowedData(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update.",
      });
    }

    const validationError = validateContentFields(updates);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (updates.section !== undefined) {
      updates.section = updates.section.trim();

      if (!updates.section) {
        return res.status(400).json({
          success: false,
          message: "Section cannot be empty.",
        });
      }

      const duplicate = await WebsiteContent.findOne({
        section: updates.section,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another section already uses this name.",
        });
      }
    }

    const content = await WebsiteContent.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Website content not found.",
      });
    }

    Object.assign(content, updates);
    content.updatedBy = req.user._id;

    await content.save();

    await content.populate("updatedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Website content updated successfully.",
      content,
    });
  } catch (error) {
    return handleContentError(
      error,
      res,
      "Failed to update website content."
    );
  }
};

// ADMIN: Delete website content
export const deleteWebsiteContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID.",
      });
    }

    const deletedContent = await WebsiteContent.findByIdAndDelete(id);

    if (!deletedContent) {
      return res.status(404).json({
        success: false,
        message: "Website content not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Website content deleted successfully.",
    });
  } catch (error) {
    return handleContentError(
      error,
      res,
      "Failed to delete website content."
    );
  }
};
