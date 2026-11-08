import mongoose from "mongoose";

const websiteContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    subtitle: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    buttonText: {
      type: String,
      trim: true,
      default: "",
    },

    buttonLink: {
      type: String,
      trim: true,
      default: "",
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const WebsiteContent = mongoose.model(
  "WebsiteContent",
  websiteContentSchema
);

export default WebsiteContent;