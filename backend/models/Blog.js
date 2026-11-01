
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
      default: "",
    },

    // Featured article selection
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // SEO settings
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

    // Social sharing image
    socialImage: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
    },

    tags: {
      type: [String],
      default: [],
    },

    author: {
      type: String,
      default: "Baphin Tech",
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

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
