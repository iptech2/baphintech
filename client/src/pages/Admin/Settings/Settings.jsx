
import { useEffect, useState } from "react";
import {
  FaSave,
  FaCog,
  FaGlobe,
  FaEnvelope,
  FaShareAlt,
  FaSync,
} from "react-icons/fa";
import api from "../../../services/api";

const initialSettings = {
  siteName: "Baphin Tech",
  siteDescription: "",
  siteLogo: "",
  favicon: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    github: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    whatsapp: "",
  },
  maintenanceMode: false,
};

const Settings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/settings/admin");
      const data = response.data.settings || {};

      setSettings({
        ...initialSettings,
        ...data,
        socialLinks: {
          ...initialSettings.socialLinks,
          ...(data.socialLinks || {}),
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load website settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put("/settings/admin", settings);

      setSettings((prev) => ({
        ...prev,
        ...response.data.settings,
        socialLinks: {
          ...prev.socialLinks,
          ...(response.data.settings?.socialLinks || {}),
        },
      }));

      setSuccess("Website settings saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save website settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white";

  const labelClass =
    "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-gray-500">
        <FaSync className="mr-2 animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full space-y-6 overflow-x-hidden px-1 pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <FaCog size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your website's general information and configuration.
            </p>
          </div>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information */}
        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <FaGlobe className="text-blue-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              General Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Website Name</label>
              <input
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Website Logo URL</label>
              <input
                name="siteLogo"
                value={settings.siteLogo}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Favicon URL</label>
              <input
                name="favicon"
                value={settings.favicon}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Website Description</label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-900 dark:bg-gray-900">
          <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <FaEnvelope className="text-blue-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Business Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <FaShareAlt className="text-blue-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Social Media Links
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            {Object.keys(initialSettings.socialLinks).map((platform) => (
              <div key={platform}>
                <label className={labelClass}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>

                <input
                  type="url"
                  name={platform}
                  value={settings.socialLinks[platform] || ""}
                  onChange={handleSocialChange}
                  placeholder={`https://${platform}.com/...`}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Maintenance Mode */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Maintenance Mode
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enable this option to mark the website as under maintenance.
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {settings.maintenanceMode ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <FaSync />
            Reload Settings
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <FaSave />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
