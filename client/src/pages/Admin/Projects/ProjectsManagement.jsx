
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaGithub,
  FaExternalLinkAlt,
  FaFolderOpen,
  FaSave,
} from "react-icons/fa";

import api from "../../../services/api";

const emptyForm = {
  title: "",
  shortDescription: "",
  description: "",
  category: "Web Development",
  technologies: "",
  coverImage: "",
  screenshots: "",
  githubUrl: "",
  liveDemoUrl: "",
  features: "",
  codeExamples: [],
  visibility: "public",
  status: "draft",
  featured: false,
};

function ProjectsManagement() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects/admin/all");
      setProjects(response.data.projects || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load projects. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openNewProject = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditProject = (project) => {
    setEditingId(project._id);

    setForm({
      title: project.title || "",
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      category: project.category || "Web Development",
      technologies: (project.technologies || []).join(", "),
      coverImage: project.coverImage || "",
      screenshots: (project.screenshots || []).join("\n"),
      githubUrl: project.githubUrl || "",
      liveDemoUrl: project.liveDemoUrl || "",
      features: (project.features || []).join("\n"),
      codeExamples: project.codeExamples || [],
      visibility: project.visibility || "public",
      status: project.status || "draft",
      featured: Boolean(project.featured),
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const saveProject = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        screenshots: form.screenshots
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        features: form.features
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setSuccess("Project updated successfully.");
      } else {
        await api.post("/projects", payload);
        setSuccess("Project created successfully.");
      }

      await fetchProjects();
      closeForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save project. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/projects/${id}`);
      setProjects((previous) =>
        previous.filter((project) => project._id !== id)
      );
      setSuccess("Project deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete project."
      );
    }
  };

  const togglePublish = async (project) => {
    const nextStatus =
      project.status === "published" ? "draft" : "published";

    try {
      setError("");

      await api.put(`/projects/${project._id}`, {
        status: nextStatus,
      });

      await fetchProjects();
      setSuccess(
        nextStatus === "published"
          ? "Project published successfully."
          : "Project moved to drafts."
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update project status."
      );
    }
  };

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    return (
      project.title?.toLowerCase().includes(searchText) ||
      project.category?.toLowerCase().includes(searchText) ||
      project.technologies?.some((technology) =>
        technology.toLowerCase().includes(searchText)
      )
    );
  });

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200";

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Projects Management
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Add, edit, publish and manage your portfolio projects.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewProject}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FaPlus />
          Add New Project
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          {success}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Total Projects</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {projects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Published</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {projects.filter((item) => item.status === "published").length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Drafts</p>
          <p className="mt-2 text-3xl font-bold text-orange-500">
            {projects.filter((item) => item.status === "draft").length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects by name, category or technology..."
          className={`${inputClass} pl-11`}
        />
      </div>

      {/* Projects list */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">
            All Projects
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <FaFolderOpen className="mx-auto text-4xl text-slate-300" />
            <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">
              No projects found
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Add your first project to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaFolderOpen className="text-2xl text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {project.title}
                    </h4>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {project.shortDescription}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {project.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          project.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                        }`}
                      >
                        {project.status}
                      </span>

                      {project.visibility === "members" && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          Members only
                        </span>
                      )}
                    </div>

                    {project.technologies?.length > 0 && (
                      <p className="mt-2 text-xs text-slate-500">
                        {project.technologies.join(" · ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="GitHub"
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <FaGithub />
                    </a>
                  )}

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Live Demo"
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <FaExternalLinkAlt />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => togglePublish(project)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {project.status === "published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditProject(project)}
                    title="Edit project"
                    className="rounded-lg bg-blue-50 p-2.5 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900"
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProject(project._id)}
                    title="Delete project"
                    className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add/Edit project form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-3 sm:p-6">
          <div className="my-auto w-full max-w-4xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900 sm:px-7">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit Project" : "Add New Project"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Enter your project information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close form"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveProject} className="space-y-6 p-5 sm:p-7">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Project Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    required
                    maxLength={150}
                    className={inputClass}
                    placeholder="e.g. Baphin Tech Portfolio"
                  />
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option>Web Development</option>
                    <option>Mobile Development</option>
                    <option>Desktop Application</option>
                    <option>UI/UX Design</option>
                    <option>Cybersecurity</option>
                    <option>Data & AI</option>
                    <option>Networking</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Short Description *</label>
                <textarea
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={updateField}
                  required
                  maxLength={300}
                  rows={2}
                  className={inputClass}
                  placeholder="A brief summary displayed on project cards."
                />
              </div>

              <div>
                <label className={labelClass}>Full Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  required
                  rows={5}
                  className={inputClass}
                  placeholder="Explain the project, its purpose and how it works..."
                />
              </div>

              <div>
                <label className={labelClass}>
                  Technologies (separate with commas)
                </label>
                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="React, Node.js, MongoDB, Express"
                />
              </div>

              <div>
                <label className={labelClass}>Cover Image URL</label>
                <input
                  name="coverImage"
                  type="url"
                  value={form.coverImage}
                  onChange={updateField}
                  className={inputClass}
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Screenshot URLs (one URL per line)
                </label>
                <textarea
                  name="screenshots"
                  value={form.screenshots}
                  onChange={updateField}
                  rows={3}
                  className={inputClass}
                  placeholder={"https://example.com/screenshot-1.jpg\nhttps://example.com/screenshot-2.jpg"}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>GitHub Repository URL</label>
                  <input
                    name="githubUrl"
                    type="url"
                    value={form.githubUrl}
                    onChange={updateField}
                    className={inputClass}
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div>
                  <label className={labelClass}>Live Demo URL</label>
                  <input
                    name="liveDemoUrl"
                    type="url"
                    value={form.liveDemoUrl}
                    onChange={updateField}
                    className={inputClass}
                    placeholder="https://your-project.com"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Project Features (one per line)
                </label>
                <textarea
                  name="features"
                  value={form.features}
                  onChange={updateField}
                  rows={4}
                  className={inputClass}
                  placeholder={"User authentication\nResponsive interface\nAdmin dashboard"}
                />
              </div>

              {/* Code examples */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Code Examples
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Add code that registered users can explore.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        codeExamples: [
                          ...previous.codeExamples,
                          {
                            title: "",
                            language: "javascript",
                            description: "",
                            code: "",
                          },
                        ],
                      }))
                    }
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 dark:bg-blue-950"
                  >
                    <FaPlus className="mr-2 inline" />
                    Add Code
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {form.codeExamples.map((example, index) => (
                    <div
                      key={example._id || index}
                      className="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700 dark:text-white">
                          Code Example {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setForm((previous) => ({
                              ...previous,
                              codeExamples: previous.codeExamples.filter(
                                (_, itemIndex) => itemIndex !== index
                              ),
                            }))
                          }
                          className="text-sm text-red-500"
                        >
                          Remove
                        </button>
                      </div>

                      <input
                        value={example.title}
                        onChange={(event) => {
                          const updated = [...form.codeExamples];
                          updated[index] = {
                            ...updated[index],
                            title: event.target.value,
                          };
                          setForm((previous) => ({
                            ...previous,
                            codeExamples: updated,
                          }));
                        }}
                        className={inputClass}
                        placeholder="Code example title"
                      />

                      <select
                        value={example.language}
                        onChange={(event) => {
                          const updated = [...form.codeExamples];
                          updated[index] = {
                            ...updated[index],
                            language: event.target.value,
                          };
                          setForm((previous) => ({
                            ...previous,
                            codeExamples: updated,
                          }));
                        }}
                        className={inputClass}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="jsx">React / JSX</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="php">PHP</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="sql">SQL</option>
                        <option value="bash">Bash</option>
                      </select>

                      <textarea
                        value={example.description}
                        onChange={(event) => {
                          const updated = [...form.codeExamples];
                          updated[index] = {
                            ...updated[index],
                            description: event.target.value,
                          };
                          setForm((previous) => ({
                            ...previous,
                            codeExamples: updated,
                          }));
                        }}
                        rows={2}
                        className={inputClass}
                        placeholder="Explain what this code does..."
                      />

                      <textarea
                        value={example.code}
                        onChange={(event) => {
                          const updated = [...form.codeExamples];
                          updated[index] = {
                            ...updated[index],
                            code: event.target.value,
                          };
                          setForm((previous) => ({
                            ...previous,
                            codeExamples: updated,
                          }));
                        }}
                        rows={7}
                        className={`${inputClass} font-mono text-xs`}
                        placeholder="Paste your source code here..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Publishing settings */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Project Visibility</label>
                  <select
                    name="visibility"
                    value={form.visibility}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="public">Public</option>
                    <option value="members">Registered Members Only</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Publication Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Project</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={updateField}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                Feature this project on the website
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaSave />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Project"
                      : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsManagement;
