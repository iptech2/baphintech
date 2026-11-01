
import Blog from "../models/Blog.js";

const createSlug = (title = "") =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Safely convert boolean values from frontend requests.
const parseBoolean = (value) => {
  return value === true || value === "true";
};

// Keep only one published featured article at a time.
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

// PUBLIC: Get published blog posts.
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" })
      .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 });

    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUBLIC: Get one published blog by slug.
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all blog posts.
export const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Create blog post.
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

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        message: "Title, excerpt and content are required.",
      });
    }

    const finalSlug = createSlug(slug || title);

    if (!finalSlug) {
      return res.status(400).json({
        message: "Please provide a valid article title or URL slug.",
      });
    }

    const finalStatus = status || "draft";

    if (!["draft", "published"].includes(finalStatus)) {
      return res.status(400).json({
        message: "Invalid publication status.",
      });
    }

    const existingBlog = await Blog.findOne({
      slug: finalSlug,
    });

    if (existingBlog) {
      return res.status(409).json({
        message: "A blog post with this slug already exists.",
      });
    }

    const blog = await Blog.create({
      title,
      slug: finalSlug,
      excerpt,
      content,
      featuredImage: featuredImage || "",
      category: category || "Technology",
      tags: Array.isArray(tags) ? tags : [],
      author: author || "Baphin Tech",
      status: finalStatus,
      isFeatured: parseBoolean(isFeatured),
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

    res.status(201).json({
      message: "Blog post created successfully.",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Update blog post.
export const updateBlog = async (req, res) => {
  try {
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
      blog.title = title;
    }

    if (slug !== undefined) {
      blog.slug = createSlug(slug || title || blog.title);
    }

    if (excerpt !== undefined) {
      blog.excerpt = excerpt;
    }

    if (content !== undefined) {
      blog.content = content;
    }

    if (featuredImage !== undefined) {
      blog.featuredImage = featuredImage;
    }

    if (category !== undefined) {
      blog.category = category;
    }

    if (tags !== undefined) {
      blog.tags = Array.isArray(tags) ? tags : [];
    }

    if (author !== undefined) {
      blog.author = author;
    }

    if (isFeatured !== undefined) {
      blog.isFeatured = parseBoolean(isFeatured);
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

    if (!blog.slug) {
      return res.status(400).json({
        message: "A valid article slug is required.",
      });
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

    res.status(200).json({
      message: "Blog post updated successfully.",
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Delete blog post.
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog post not found.",
      });
    }

    res.status(200).json({
      message: "Blog post deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
