
import mongoose from "mongoose";
import Service from "../models/Service.js";

const allowedFields = [
  "title",
  "shortDescription",
  "description",
  "icon",
  "image",
  "features",
  "technologies",
  "status",
  "featured",
  "displayOrder",
];

const getServiceData = (body = {}) => {
  const data = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  return data;
};

const validateServiceData = (data) => {
  if (
    data.title !== undefined &&
    (typeof data.title !== "string" ||
      !data.title.trim() ||
      data.title.length > 150)
  ) {
    return "Title must be a valid string of up to 150 characters";
  }

  if (
    data.shortDescription !== undefined &&
    (typeof data.shortDescription !== "string" ||
      !data.shortDescription.trim() ||
      data.shortDescription.length > 300)
  ) {
    return "Short description must be a valid string of up to 300 characters";
  }

  if (
    data.description !== undefined &&
    (typeof data.description !== "string" ||
      !data.description.trim())
  ) {
    return "A valid description is required";
  }

  for (const field of ["icon", "image"]) {
    if (
      data[field] !== undefined &&
      typeof data[field] !== "string"
    ) {
      return `${field} must be a string`;
    }
  }

  for (const field of ["features", "technologies"]) {
    if (
      data[field] !== undefined &&
      (!Array.isArray(data[field]) ||
        !data[field].every(
          (item) => typeof item === "string"
        ))
    ) {
      return `${field} must be an array of strings`;
    }
  }

  if (
    data.status !== undefined &&
    !["draft", "published"].includes(data.status)
  ) {
    return "Invalid service status";
  }

  if (
    data.featured !== undefined &&
    typeof data.featured !== "boolean"
  ) {
    return "Featured must be true or false";
  }

  if (
    data.displayOrder !== undefined &&
    (!Number.isInteger(data.displayOrder) ||
      data.displayOrder < 0)
  ) {
    return "Display order must be a non-negative integer";
  }

  return null;
};

const handleServiceError = (res, error, message) => {
  console.error(message, error);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A service with this title or slug already exists",
    });
  }

  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid service information. Please check your entries.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred",
  });
};

// PUBLIC: Get published services
export const getPublicServices = async (req, res) => {
  try {
    const services = await Service.find({
      status: "published",
    })
      .select(
        "title slug shortDescription description icon image features technologies featured displayOrder"
      )
      .sort({ displayOrder: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    return handleServiceError(
      res,
      error,
      "Get public services error:"
    );
  }
};

// ADMIN: Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("createdBy", "name email")
      .sort({ displayOrder: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    return handleServiceError(
      res,
      error,
      "Get all services error:"
    );
  }
};

// ADMIN: Create service
export const createService = async (req, res) => {
  try {
    const data = getServiceData(req.body);

    if (
      !data.title ||
      !data.shortDescription ||
      !data.description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, short description and description are required",
      });
    }

    const validationError = validateServiceData(data);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const service = await Service.create({
      ...data,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    return handleServiceError(
      res,
      error,
      "Create service error:"
    );
  }
};

// ADMIN: Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const data = getServiceData(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid service fields provided",
      });
    }

    const validationError = validateServiceData(data);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    Object.assign(service, data);

    // Document save runs the Service model's pre-validate
    // hook, which regenerates and checks the unique slug.
    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    return handleServiceError(
      res,
      error,
      "Update service error:"
    );
  }
};

// ADMIN: Delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    return handleServiceError(
      res,
      error,
      "Delete service error:"
    );
  }
};
