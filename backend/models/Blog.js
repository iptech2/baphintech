
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

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
