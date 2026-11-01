
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

const getProjectData = (body) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

// Public: list published project previews
export const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "published" })
      .select(
        "title slug shortDescription category technologies coverImage featured createdAt"
      )
      .sort({ featured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve projects",
    });
  }
};

// Admin: list all projects, including drafts
export const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve admin projects",
    });
  }
};

// Registered users: get full project details
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.status !== "published" &&
      req.user.role !== "admin"
    ) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      project.visibility === "members" &&
      req.user.role !== "admin"
    ) {
      // Registered users can access members-only projects.
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve project",
    });
  }
};

// Admin: create project
export const createProject = async (req, res) => {
  try {
    const projectData = getProjectData(req.body);

    if (
      !projectData.title ||
      !projectData.shortDescription ||
      !projectData.description
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, short description and description are required",
      });
    }

    if (projectData.status === "published") {
      projectData.publishedAt = new Date();
    }

    const project = await Project.create({
      ...projectData,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.code === 11000
        ? "A project with a similar title already exists"
        : "Unable to create project",
    });
  }
};

// Admin: update project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updateData = getProjectData(req.body);
    const wasPublished = project.status === "published";

    Object.assign(project, updateData);

    if (project.status === "published" && !wasPublished) {
      project.publishedAt = new Date();
    }

    if (project.status === "draft") {
      project.publishedAt = null;
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.code === 11000
        ? "A project with a similar title already exists"
        : "Unable to update project",
    });
  }
};

// Admin: delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete project",
    });
  }
};
