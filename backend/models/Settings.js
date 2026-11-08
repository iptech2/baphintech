import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Baphin Tech",
      trim: true,
    },
    siteDescription: {
      type: String,
      default: "",
      trim: true,
    },
    siteLogo: {
      type: String,
      default: "",
      trim: true,
    },
    favicon: {
      type: String,
      default: "",
      trim: true,
    },
    contactEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    socialLinks: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;