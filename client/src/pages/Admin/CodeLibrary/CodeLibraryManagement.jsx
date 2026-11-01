
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaCode,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import api from "../../../services/api";

const initialForm = {
  title: "",
  description: "",
  category: "General",
  language: "JavaScript",
  code: "",
  technologies: "",
  status: "draft",
  relatedProject: "",
};

function CodeLibraryManagement() {
  const [snippets, setSnippets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [snippetResponse, projectResponse] = await Promise.all([
        api.get("/code-library/admin/all"),
        api.get("/projects/admin/all"),
      ]);

      setSnippets(snippetResponse.data.snippets || []);
      setProjects(projectResponse.data.projects || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load Code Library data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...initialForm });
    setError("");
    setMessage("");
    setModalOpen(true);
  };

  const openEditModal = (snippet) => {
    setEditingId(snippet._id);

    setForm({
      title: snippet.title || "",
      description: snippet.description || "",
      category: snippet.category || "General",
      language: snippet.language || "JavaScript",
      code: snippet.code || "",
      technologies: (snippet.technologies || []).join(", "),
      status: snippet.status || "draft",
      relatedProject: snippet.relatedProject?._id || "",
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
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim() || "General",
        language: form.language.trim(),
        code: form.code,
        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        status: form.status,
        relatedProject: form.relatedProject || null,
      };

      if (editingId) {
        await api.put(`/code-library/${editingId}`, payload);
        setMessage("Code snippet updated successfully.");
      } else {
        await api.post("/code-library", payload);
        setMessage("Code snippet created successfully.");
      }

      setModalOpen(false);
      setForm({ ...initialForm });
      setEditingId(null);

      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save code snippet."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (snippet) => {
    try {
      setError("");
      setMessage("");

      const newStatus =
        snippet.status === "published" ? "draft" : "published";

      await api.put(`/code-library/${snippet._id}`, {
        status: newStatus,
      });

      setMessage(
        newStatus === "published"
          ? "Snippet published successfully."
          : "Snippet moved to drafts successfully."
      );

      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update snippet status."
      );
    }
  };

  const deleteSnippet = async (snippet) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${snippet.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/code-library/${snippet._id}`);

      setMessage("Code snippet deleted successfully.");
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete code snippet."
      );
    }
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const searchText = search.toLowerCase();

    return [
      snippet.title,
      snippet.description,
      snippet.language,
      snippet.category,
      ...(snippet.technologies || []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchText);
  });

  const publishedCount = snippets.filter(
    (snippet) => snippet.status === "published"
  ).length;

  const draftCount = snippets.filter(
    (snippet) => snippet.status === "draft"
  ).length;

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <FaCode className="text-2xl text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Code Library
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create, organize and publish programming code snippets.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FaPlus />
          Add New Snippet
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
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Total Snippets</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {snippets.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Published</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {publishedCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Drafts</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-600">
            {draftCount}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search snippets..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Snippets table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading code snippets...
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="p-12 text-center">
            <FaCode className="mx-auto text-4xl text-slate-300" />
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
              No snippets found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Add a new snippet or try another search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Snippet</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSnippets.map((snippet) => (
                  <tr
                    key={snippet._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {snippet.title}
                      </p>
                      <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                        {snippet.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {snippet.language}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {snippet.category}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          snippet.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {snippet.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(snippet)}
                          title="Edit snippet"
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleStatus(snippet)}
                          title={
                            snippet.status === "published"
                              ? "Unpublish snippet"
                              : "Publish snippet"
                          }
                          className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                        >
                          {snippet.status === "published" ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteSnippet(snippet)}
                          title="Delete snippet"
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
          <div className="my-auto flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

            {/* Fixed modal header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit Code Snippet" : "Add New Code Snippet"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter the details and source code below.
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

            {/* Independently scrollable form */}
            <form
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Snippet Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. JWT Authentication"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Programming Language *
                  </label>
                  <input
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    required
                    placeholder="e.g. JavaScript, Python, PHP"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Authentication, API, Database"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Technologies
                  </label>
                  <input
                    name="technologies"
                    value={form.technologies}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Separate technologies with commas.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Explain what this code does..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Source Code *
                </label>
                <textarea
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  required
                  rows={12}
                  spellCheck={false}
                  placeholder="Paste your source code here..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-950 px-4 py-4 font-mono text-sm leading-6 text-green-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Related Project (Optional)
                </label>
                <select
                  name="relatedProject"
                  value={form.relatedProject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">No related project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Publication Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Immediately</option>
                </select>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                  {error}
                </div>
              )}

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
                      ? "Update Snippet"
                      : "Save Snippet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeLibraryManagement;