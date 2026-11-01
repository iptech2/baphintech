
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaNewspaper,
  FaStar,
} from "react-icons/fa";

import api from "../../../services/api";

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "Technology",
  tags: "",
  author: "Baphin Tech",
  status: "draft",
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
  socialImage: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

const labelClass =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/blogs/admin/all");
      const result = response.data;

      setBlogs(
        Array.isArray(result)
          ? result
          : result?.blogs || result?.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load blog posts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...initialForm });
    setError("");
    setMessage("");
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingId(blog._id);

    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featuredImage: blog.featuredImage || "",
      category: blog.category || "Technology",
      tags: (blog.tags || []).join(", "),
      author: blog.author || "Baphin Tech",
      status: blog.status || "draft",
      isFeatured: Boolean(blog.isFeatured),
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
      socialImage: blog.socialImage || "",
    });

    setError("");
    setMessage("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await api.put(`/blogs/${editingId}`, payload);
        setMessage("Blog post updated successfully.");
      } else {
        await api.post("/blogs", payload);
        setMessage("Blog post created successfully.");
      }

      setModalOpen(false);
      setForm({ ...initialForm });
      setEditingId(null);

      await fetchBlogs();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save blog post."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (blog) => {
    try {
      setError("");
      setMessage("");

      const newStatus =
        blog.status === "published" ? "draft" : "published";

      await api.put(`/blogs/${blog._id}`, {
        status: newStatus,
      });

      setMessage(
        newStatus === "published"
          ? "Blog post published successfully."
          : "Blog post moved to drafts."
      );

      await fetchBlogs();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update blog status."
      );
    }
  };

  const deleteBlog = async (blog) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/blogs/${blog._id}`);

      setMessage("Blog post deleted successfully.");
      await fetchBlogs();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete blog post."
      );
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    [
      blog.title,
      blog.excerpt,
      blog.category,
      blog.author,
      ...(blog.tags || []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const publishedCount = blogs.filter(
    (blog) => blog.status === "published"
  ).length;

  const draftCount = blogs.filter(
    (blog) => blog.status === "draft"
  ).length;

  const featuredCount = blogs.filter(
    (blog) => blog.isFeatured
  ).length;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <FaNewspaper className="text-2xl text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Blog Management
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create, manage and publish articles on Baphin Tech.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FaPlus />
          Create Blog Post
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Articles",
            value: blogs.length,
            color: "text-slate-900 dark:text-white",
          },
          {
            label: "Published",
            value: publishedCount,
            color: "text-green-600",
          },
          {
            label: "Drafts",
            value: draftCount,
            color: "text-amber-600",
          },
          {
            label: "Featured",
            value: featuredCount,
            color: "text-blue-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <h2 className={`mt-2 text-3xl font-bold ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className={`${inputClass} pl-11`}
        />
      </div>

      {/* Blog table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading articles...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center">
            <FaNewspaper className="mx-auto text-4xl text-slate-300" />
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
              No blog posts found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Create your first article to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {blog.title}
                      </p>
                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                        {blog.excerpt}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {blog.category}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {blog.author}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {blog.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <FaStar /> Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          No
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(blog)}
                          title="Edit article"
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleStatus(blog)}
                          title={
                            blog.status === "published"
                              ? "Unpublish article"
                              : "Publish article"
                          }
                          className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                        >
                          {blog.status === "published" ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteBlog(blog)}
                          title="Delete article"
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-slate-950/70 p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="my-auto flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit Blog Post" : "Create Blog Post"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add your article details, SEO information and images.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain p-5"
            >
              {/* Article information */}
              <section className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Article Information
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Main details visitors will see on your blog.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Article Title *</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter article title"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>URL Slug</label>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="Leave blank to generate from title"
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Example: getting-started-with-web-development
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Category</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="Technology"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Author</label>
                    <input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Short Excerpt *</label>
                    <textarea
                      name="excerpt"
                      value={form.excerpt}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="A short introduction to your article..."
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Article Content *</label>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      required
                      rows={14}
                      placeholder="Write your complete article here..."
                      className={`${inputClass} leading-7`}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Plain text is supported for now. We'll add a rich text editor later.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Tags</label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="Web Development, AI, Technology"
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Separate tags with commas.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Publication Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="published">Publish Immediately</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Featured article */}
              <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Featured Article
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Choose whether this article should receive featured placement on the blog.
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />
                  <span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <FaStar className="text-amber-500" />
                      Make this a featured article
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Featured articles can be highlighted separately from other posts.
                    </span>
                  </span>
                </label>
              </section>

              {/* Featured image */}
              <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Article Image
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Main image displayed with the article.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Featured Image URL</label>
                  <input
                    name="featuredImage"
                    type="url"
                    value={form.featuredImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={inputClass}
                  />

                  {form.featuredImage && (
                    <img
                      src={form.featuredImage}
                      alt="Featured article preview"
                      className="mt-3 h-48 w-full rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = "block";
                      }}
                    />
                  )}
                </div>
              </section>

              {/* SEO settings */}
              <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    SEO Settings
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Help search engines understand and display your article.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>SEO Title</label>
                  <input
                    name="seoTitle"
                    value={form.seoTitle}
                    onChange={handleChange}
                    maxLength={70}
                    placeholder="Leave blank to use the article title"
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    {form.seoTitle.length}/70 characters
                  </p>
                </div>

                <div>
                  <label className={labelClass}>SEO Description</label>
                  <textarea
                    name="seoDescription"
                    value={form.seoDescription}
                    onChange={handleChange}
                    maxLength={170}
                    rows={3}
                    placeholder="Write a short description for search engine results..."
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    {form.seoDescription.length}/170 characters
                  </p>
                </div>
              </section>

              {/* Social sharing */}
              <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Social Sharing
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Set the image that appears when someone shares your article on WhatsApp, Facebook or LinkedIn.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Social Sharing Image URL</label>
                  <input
                    name="socialImage"
                    type="url"
                    value={form.socialImage}
                    onChange={handleChange}
                    placeholder="https://example.com/social-image.jpg"
                    className={inputClass}
                  />

                  {form.socialImage && (
                    <img
                      src={form.socialImage}
                      alt="Social sharing preview"
                      className="mt-3 aspect-[1.91/1] w-full rounded-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = "block";
                      }}
                    />
                  )}
                </div>
              </section>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Form actions */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaSave />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Article"
                      : "Save Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
