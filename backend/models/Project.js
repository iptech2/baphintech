
import mongoose from "mongoose";

const codeExampleSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    language: { type: String, trim: true, required: true },
    code: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Web Development",
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: "",
    },
    screenshots: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: "",
    },
    liveDemoUrl: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    codeExamples: {
      type: [codeExampleSchema],
      default: [],
    },
    visibility: {
      type: String,
      enum: ["public", "members"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

projectSchema.pre("validate", function () {
  if (this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
