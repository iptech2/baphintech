
import mongoose from "mongoose";
import Blog from "../models/Blog.js";

const createSlug = (value = "") =>
  typeof value === "string"
    ? value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    : "";

const parseBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return null;
};

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleError = (res, error, message) => {
  console.error(message, error);

  if (error.code === 11000) {
    return res.status(409).json({
      message: "A blog post with this slug already exists.",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Please check the blog information provided.",
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid blog information.",
    });
  }

  return res.status(500).json({
    message: "An unexpected server error occurred.",
  });
};

// Keep one published featured article at a time.
const clearOtherFeaturedBlogs = async (currentBlogId) => {
  await Blog.updateMany(
    {
      _id: { $ne: currentBlogId },
      status: "published",
      isFeatured: true,
    },
    {
      $set: { isFeatured: false },
    }
  );
};

// PUBLIC: Get published blogs.
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "published",
    }).sort({
      isFeatured: -1,
      publishedAt: -1,
      createdAt: -1,
    });

    return res.status(200).json({ blogs });
  } catch (error) {
    return handleError(res, error, "Get published blogs error:");
  }
};

// PUBLIC: Get one published blog by slug.
export const getBlogBySlug = async (req, res) => {
  try {
    const slug = createSlug(req.params.slug);

    if (!slug) {
      return res.status(400).json({
        message: "Invalid blog slug.",
      });
    }

    const blog = await Blog.findOne({
      slug,
      status: "published",
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    return handleError(res, error, "Get blog by slug error:");
  }
};

// ADMIN: Get all blogs.
export const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ blogs });
  } catch (error) {
    return handleError(res, error, "Get admin blogs error:");
  }
};

// ADMIN: Create blog.
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      author,
      status,
      isFeatured,
      seoTitle,
      seoDescription,
      socialImage,
    } = req.body;

    if (
      typeof title !== "string" ||
      typeof excerpt !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !excerpt.trim() ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Title, excerpt and content are required.",
      });
    }

    const finalSlug = createSlug(slug || title);

    if (!finalSlug) {
      return res.status(400).json({
        message: "Please provide a valid article title or slug.",
      });
    }

    const finalStatus = status || "draft";

    if (!["draft", "published"].includes(finalStatus)) {
      return res.status(400).json({
        message: "Invalid publication status.",
      });
    }

    const featured =
      isFeatured === undefined ? false : parseBoolean(isFeatured);

    if (featured === null) {
      return res.status(400).json({
        message: "Invalid featured article value.",
      });
    }

    if (
      tags !== undefined &&
      (!Array.isArray(tags) ||
        !tags.every((tag) => typeof tag === "string"))
    ) {
      return res.status(400).json({
        message: "Invalid blog tags.",
      });
    }

    const blog = await Blog.create({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim(),
      content,
      featuredImage: featuredImage || "",
      category: category || "Technology",
      tags: tags || [],
      author: author || "Baphin Tech",
      status: finalStatus,
      isFeatured: featured,
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      socialImage: socialImage || "",
      createdBy: req.user._id,
      publishedAt:
        finalStatus === "published" ? new Date() : null,
    });

    if (blog.status === "published" && blog.isFeatured) {
      await clearOtherFeaturedBlogs(blog._id);
    }

    return res.status(201).json({
      message: "Blog post created successfully.",
      blog,
    });
  } catch (error) {
    return handleError(res, error, "Create blog error:");
  }
};

// ADMIN: Update blog.
export const updateBlog = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID.",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      author,
      status,
      isFeatured,
      seoTitle,
      seoDescription,
      socialImage,
    } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Invalid blog title.",
        });
      }

      blog.title = title.trim();
    }

    if (slug !== undefined) {
      const finalSlug = createSlug(slug || blog.title);

      if (!finalSlug) {
        return res.status(400).json({
          message: "A valid article slug is required.",
        });
      }

      blog.slug = finalSlug;
    }

    if (excerpt !== undefined) {
      if (typeof excerpt !== "string" || !excerpt.trim()) {
        return res.status(400).json({
          message: "Invalid blog excerpt.",
        });
      }

      blog.excerpt = excerpt.trim();
    }

    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
          message: "Blog content cannot be empty.",
        });
      }

      blog.content = content;
    }

    if (featuredImage !== undefined) {
      blog.featuredImage = featuredImage;
    }

    if (category !== undefined) {
      blog.category = category;
    }

    if (tags !== undefined) {
      if (
        !Array.isArray(tags) ||
        !tags.every((tag) => typeof tag === "string")
      ) {
        return res.status(400).json({
          message: "Invalid blog tags.",
        });
      }

      blog.tags = tags;
    }

    if (author !== undefined) {
      blog.author = author;
    }

    if (isFeatured !== undefined) {
      const featured = parseBoolean(isFeatured);

      if (featured === null) {
        return res.status(400).json({
          message: "Invalid featured article value.",
        });
      }

      blog.isFeatured = featured;
    }

    if (seoTitle !== undefined) {
      blog.seoTitle = seoTitle;
    }

    if (seoDescription !== undefined) {
      blog.seoDescription = seoDescription;
    }

    if (socialImage !== undefined) {
      blog.socialImage = socialImage;
    }

    if (status !== undefined) {
      if (!["draft", "published"].includes(status)) {
        return res.status(400).json({
          message: "Invalid publication status.",
        });
      }

      blog.status = status;

      if (status === "published" && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }

      if (status === "draft") {
        blog.publishedAt = null;
      }
    }

    const duplicate = await Blog.findOne({
      slug: blog.slug,
      _id: { $ne: blog._id },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Another blog post already uses this slug.",
      });
    }

    await blog.save();

    if (blog.status === "published" && blog.isFeatured) {
      await clearOtherFeaturedBlogs(blog._id);
    }

    return res.status(200).json({
      message: "Blog post updated successfully.",
      blog,
    });
  } catch (error) {
    return handleError(res, error, "Update blog error:");
  }
};

// ADMIN: Delete blog.
export const deleteBlog = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID.",
      });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    return res.status(200).json({
      message: "Blog post deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error, "Delete blog error:");
  }
};
