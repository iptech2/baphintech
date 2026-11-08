
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },

    icon: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    features: {
      type: [String],
      default: [],
    },

    technologies: {
      type: [String],
      default: [],
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

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Generate a URL-friendly slug.
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Automatically generate a unique slug.
serviceSchema.pre("validate", async function () {
  if (!this.title) return;

  const baseSlug = generateSlug(this.title);

  if (!baseSlug) {
    throw new Error("Service title must contain valid characters.");
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingService = await mongoose.models.Service.findOne({
      slug,
      _id: { $ne: this._id },
    }).select("_id");

    if (!existingService) break;

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  this.slug = slug;
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
