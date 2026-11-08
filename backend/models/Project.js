
import mongoose from "mongoose";

const codeExampleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    language: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
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

// Generate a URL-friendly base slug.
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Generate a unique slug before saving.
projectSchema.pre("validate", async function () {
  if (!this.title) return;

  const baseSlug = generateSlug(this.title);

  if (!baseSlug) {
    throw new Error("Project title must contain valid characters.");
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingProject = await mongoose.models.Project.findOne({
      slug,
      _id: { $ne: this._id },
    }).select("_id");

    if (!existingProject) break;

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  this.slug = slug;
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
