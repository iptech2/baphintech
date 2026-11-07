
import mongoose from "mongoose";
import Project from "../models/Project.js";

const allowedFields = [
  "title",
  "shortDescription",
  "description",
  "category",
  "technologies",
  "coverImage",
  "screenshots",
  "githubUrl",
  "liveDemoUrl",
  "features",
  "codeExamples",
  "visibility",
  "status",
  "featured",
];

const getProjectData = (body = {}) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

const isValidId = (id) =>
  typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

const validateProjectData = (data) => {
  const requiredTextFields = [
    "title",
    "shortDescription",
    "description",
  ];

  for (const field of requiredTextFields) {
    if (
      data[field] !== undefined &&
      (typeof data[field] !== "string" || !data[field].trim())
    ) {
      return `${field} must be a non-empty string`;
    }
  }

  const optionalTextFields = [
    "category",
    "coverImage",
    "githubUrl",
    "liveDemoUrl",
  ];

  for (const field of optionalTextFields) {
    if (
      data[field] !== undefined &&
      typeof data[field] !== "string"
    ) {
      return `${field} must be a string`;
    }
  }

  const arrayFields = [
    "technologies",
    "screenshots",
    "features",
  ];

  for (const field of arrayFields) {
    if (data[field] !== undefined) {
      if (
        !Array.isArray(data[field]) ||
        !data[field].every((item) => typeof item === "string")
      ) {
        return `${field} must be an array of strings`;
      }
    }
  }

  if (data.codeExamples !== undefined) {
    if (!Array.isArray(data.codeExamples)) {
      return "Code examples must be an array";
    }

    for (const example of data.codeExamples) {
      if (
        !example ||
        typeof example !== "object" ||
        Array.isArray(example) ||
        typeof example.title !== "string" ||
        !example.title.trim() ||
        typeof example.language !== "string" ||
        !example.language.trim() ||
        typeof example.code !== "string"
      ) {
        return "Each code example must have a title, language and code";
      }

      if (
        example.description !== undefined &&
        typeof example.description !== "string"
      ) {
        return "Code example description must be a string";
      }
    }
  }

  if (
    data.visibility !== undefined &&
    !["public", "members"].includes(data.visibility)
  ) {
    return "Visibility must be public or members";
  }

  if (
    data.status !== undefined &&
    !["draft", "published"].includes(data.status)
  ) {
    return "Status must be draft or published";
  }

  if (
    data.featured !== undefined &&
    typeof data.featured !== "boolean"
  ) {
    return "Featured must be true or false";
  }

  return null;
};

const handleError = (res, error, fallbackMessage) => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A project with a similar title already exists",
    });
  }

  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid project data. Please check your entries.",
    });
  }

  console.error("Project controller error:", error.message);

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// Public: list published project previews
export const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: "published",
    })
      .select(
        "title slug shortDescription category technologies coverImage featured createdAt"
      )
      .sort({ featured: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to retrieve projects"
    );
  }
};

// Admin: list all projects, including drafts
export const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to retrieve admin projects"
    );
  }
};

// Registered users: get full project details
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only administrators can access unpublished projects.
    if (
      project.status !== "published" &&
      req.user.role !== "admin"
    ) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Published projects with members visibility are available
    // to authenticated registered users.
    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to retrieve project"
    );
  }
};

// Admin: create project
export const createProject = async (req, res) => {
  try {
    const projectData = getProjectData(req.body);

    const validationError = validateProjectData(projectData);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (
      !projectData.title ||
      !projectData.shortDescription ||
      !projectData.description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, short description and description are required",
      });
    }

    if (projectData.status === "published") {
      projectData.publishedAt = new Date();
    }

    const project = await Project.create({
      ...projectData,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to create project"
    );
  }
};

// Admin: update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updateData = getProjectData(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid project fields provided",
      });
    }

    const validationError = validateProjectData(updateData);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const wasPublished = project.status === "published";

    Object.assign(project, updateData);

    if (
      project.status === "published" &&
      (!wasPublished || !project.publishedAt)
    ) {
      project.publishedAt = new Date();
    }

    if (project.status === "draft") {
      project.publishedAt = null;
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to update project"
    );
  }
};

// Admin: delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Unable to delete project"
    );
  }
};
