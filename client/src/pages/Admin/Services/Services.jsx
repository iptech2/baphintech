
import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiRefreshCw,
  FiBriefcase,
} from "react-icons/fi";

import api from "../../../services/api";

const initialForm = {
  title: "",
  shortDescription: "",
  description: "",
  icon: "",
  image: "",
  features: "",
  technologies: "",
  status: "draft",
  featured: false,
  displayOrder: 0,
};

function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/services/admin/all");
      setServices(response.data.services || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEditForm = (service) => {
    setForm({
      title: service.title || "",
      shortDescription: service.shortDescription || "",
      description: service.description || "",
      icon: service.icon || "",
      image: service.image || "",
      features: (service.features || []).join(", "),
      technologies: (service.technologies || []).join(", "),
      status: service.status || "draft",
      featured: Boolean(service.featured),
      displayOrder: service.displayOrder ?? 0,
    });

    setEditingId(service._id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        features: form.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        displayOrder: Number(form.displayOrder),
      };

      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        setSuccess("Service updated successfully.");
      } else {
        await api.post("/services", payload);
        setSuccess("Service created successfully.");
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);

      await fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/services/${id}`);

      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );

      setSuccess("Service deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete service."
      );
    }
  };

  return (
    <div className="min-h-screen w-full space-y-6 overflow-x-hidden px-1 pb-10">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Services
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage the services displayed on your website.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          <FiPlus />
          Add Service
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Total Services</p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {services.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Published</p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {services.filter((s) => s.status === "published").length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Drafts</p>

          <h2 className="mt-2 text-2xl font-bold text-yellow-600">
            {services.filter((s) => s.status === "draft").length}
          </h2>
        </div>

      </div>

      {/* Services List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">

        <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            All Services
          </h2>

          <button
            onClick={fetchServices}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="p-10 text-center">
            <FiBriefcase className="mx-auto mb-3 text-3xl text-gray-400" />

            <p className="font-medium text-gray-700 dark:text-gray-200">
              No services added yet.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Start by adding your first service.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800">
                <tr>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Featured</th>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {services.map((service) => (
                  <tr key={service._id}>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {service.title}
                      </p>

                      <p className="mt-1 max-w-xs truncate text-gray-500">
                        {service.shortDescription}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          service.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {service.featured ? "Yes" : "No"}
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {service.displayOrder}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">

                        <button
                          onClick={() => openEditForm(service)}
                          title="Edit service"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(service._id)}
                          title="Delete service"
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={17} />
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

      {/* Create / Edit Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4">

          <div className="my-4 w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-900">

            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? "Edit Service" : "Add New Service"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-500"
                aria-label="Close form"
              >
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Service Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                  placeholder="Web Development"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Short Description *
                </label>

                <input
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  required
                  maxLength={300}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Full Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Icon name or class
                  </label>

                  <input
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                    placeholder="FaCode"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Image URL
                  </label>

                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                    placeholder="https://..."
                  />
                </div>

              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Features (comma-separated)
                </label>

                <textarea
                  name="features"
                  value={form.features}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                  placeholder="Responsive design, API integration, Maintenance"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Technologies (comma-separated)
                </label>

                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="displayOrder"
                    value={form.displayOrder}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-green-600"
                  />
                </div>

              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-4 w-4 accent-green-600"
                />
                Feature this service
              </label>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Service"
                    : "Create Service"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Services;
