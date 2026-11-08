
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    seoTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 70,
    },

    seoDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 170,
    },

    socialImage: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
      trim: true,
      maxlength: 80,
    },

    tags: {
      type: [String],
      default: [],
    },

    author: {
      type: String,
      default: "Baphin Tech",
      trim: true,
      maxlength: 100,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    publishedAt: {
      type: Date,
      default: null,
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
blogSchema.pre("validate", async function () {
  if (!this.title) return;

  const baseSlug = generateSlug(this.title);

  if (!baseSlug) {
    throw new Error("Blog title must contain valid characters.");
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingBlog = await mongoose.models.Blog.findOne({
      slug,
      _id: { $ne: this._id },
    }).select("_id");

    if (!existingBlog) break;

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  this.slug = slug;
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
