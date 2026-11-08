
import Settings from "../models/Settings.js";

const allowedFields = [
  "siteName",
  "siteDescription",
  "siteLogo",
  "favicon",
  "contactEmail",
  "contactPhone",
  "address",
  "socialLinks",
  "maintenanceMode",
];

const textFields = [
  "siteName",
  "siteDescription",
  "siteLogo",
  "favicon",
  "contactEmail",
  "contactPhone",
  "address",
];

const handleSettingsError = (error, res, message) => {
  console.error(message, error);

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
    message,
  });
};

const validateSettings = (updates) => {
  for (const field of textFields) {
    if (
      updates[field] !== undefined &&
      typeof updates[field] !== "string"
    ) {
      return `${field} must be valid text.`;
    }
  }

  if (
    updates.socialLinks !== undefined &&
    (
      updates.socialLinks === null ||
      typeof updates.socialLinks !== "object" ||
      Array.isArray(updates.socialLinks)
    )
  ) {
    return "Social links must be a valid object.";
  }

  if (
    updates.maintenanceMode !== undefined &&
    typeof updates.maintenanceMode !== "boolean"
  ) {
    return "Maintenance mode must be true or false.";
  }

  if (
    updates.siteName !== undefined &&
    !updates.siteName.trim()
  ) {
    return "Site name cannot be empty.";
  }

  if (
    updates.contactEmail !== undefined &&
    updates.contactEmail.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      updates.contactEmail.trim()
    )
  ) {
    return "Please provide a valid contact email.";
  }

  return null;
};

// Get or create the singleton settings document
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
};

// PUBLIC: Get website settings
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    return handleSettingsError(
      error,
      res,
      "Failed to fetch settings."
    );
  }
};

// ADMIN: Get settings
export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    await settings.populate("updatedBy", "name email");

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    return handleSettingsError(
      error,
      res,
      "Failed to fetch settings."
    );
  }
};

// ADMIN: Update settings
export const updateSettings = async (req, res) => {
  try {
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one setting to update.",
      });
    }

    const validationError = validateSettings(updates);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // Normalize text values
    textFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updates[field] = updates[field].trim();
      }
    });

    if (updates.contactEmail) {
      updates.contactEmail = updates.contactEmail.toLowerCase();
    }

    const settings = await getOrCreateSettings();

    Object.assign(settings, updates);
    settings.updatedBy = req.user._id;

    await settings.save();
    await settings.populate("updatedBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    return handleSettingsError(
      error,
      res,
      "Failed to update settings."
    );
  }
};
