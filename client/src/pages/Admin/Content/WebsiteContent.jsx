import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaGlobe,
  FaSync,
} from "react-icons/fa";
import api from "../../../services/api";

const emptyForm = {
  section: "",
  title: "",
  subtitle: "",
  description: "",
  image: "",
  buttonText: "",
  buttonLink: "",
};

const Content = () => {
  const [contents, setContents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/content/admin/all");

      setContents(response.data.content || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load website content."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item._id);

    setForm({
      section: item.section || "",
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      image: item.image || "",
      buttonText: item.buttonText || "",
      buttonLink: item.buttonLink || "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await api.put(`/content/${editingId}`, form);
        setSuccess("Website content updated successfully.");
      } else {
        await api.post("/content", form);
        setSuccess("Website content created successfully.");
      }

      closeForm();
      await fetchContent();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save website content."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this website content section?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/content/${id}`);

      setSuccess("Website content deleted successfully.");
      await fetchContent();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete website content."
      );
    }
  };

  return (
    <div className="min-h-screen w-full space-y-6 overflow-x-hidden px-1 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Website Content
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage the content displayed across your website.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchContent}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={openCreateForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <FaPlus />
            Add Content
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          {success}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Content Sections
              </p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {contents.length}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <FaGlobe size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last Updated
          </p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {contents.length
              ? new Date(
                  Math.max(
                    ...contents.map((item) =>
                      new Date(item.updatedAt || item.createdAt).getTime()
                    )
                  )
                ).toLocaleDateString()
              : "No content yet"}
          </h2>
        </div>
      </div>

      {/* Content List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Website Sections
          </h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading website content...
          </div>
        ) : contents.length === 0 ? (
          <div className="p-10 text-center">
            <FaGlobe className="mx-auto mb-3 text-3xl text-gray-400" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              No content sections yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first website content section.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {contents.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || item.section}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <FaGlobe size={22} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.title || item.section}
                    </h3>

                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      {item.section}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {item.description || item.subtitle || "No description"}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      Updated{" "}
                      {new Date(item.updatedAt || item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => openEditForm(item)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-4 w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? "Edit Website Content" : "Add Website Content"}
              </h2>

              <button
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Section Identifier *
                </label>
                <input
                  type="text"
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  placeholder="e.g. home-hero, about, contact"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use a unique identifier for each website section.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    value={form.buttonText}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Button Link
                  </label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={form.buttonLink}
                    onChange={handleChange}
                    placeholder="/projects"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <FaSave />
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;