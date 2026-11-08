
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaArchive,
  FaSearch,
  FaEye,
  FaTrash,
  FaTimes,
  FaSync,
} from "react-icons/fa";
import api from "../../../services/api";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/messages/admin/all", {
        params: { search, status },
      });

      setMessages(response.data.messages || []);
      setStats(
        response.data.stats || {
          total: 0,
          new: 0,
          read: 0,
          replied: 0,
          archived: 0,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchMessages, 400);
    return () => clearTimeout(timer);
  }, [search, status]);

  const openMessage = async (id) => {
    try {
      setError("");
      const response = await api.get(`/messages/admin/${id}`);

      setSelectedMessage(response.data.message);
      setAdminNotes(response.data.message.adminNotes || "");

      if (response.data.message.status === "new") {
        setMessages((previous) =>
          previous.map((item) =>
            item._id === id ? { ...item, status: "read" } : item
          )
        );

        setStats((previous) => ({
          ...previous,
          new: Math.max(0, previous.new - 1),
          read: previous.read + 1,
        }));
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to open message."
      );
    }
  };

  const updateMessage = async (id, data) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/messages/admin/${id}`,
        data
      );

      setSuccess(response.data.message || "Message updated.");
      setSelectedMessage(response.data.data);
      await fetchMessages();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update message."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this message?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await api.delete(`/messages/admin/${id}`);

      setSelectedMessage(null);
      setSuccess("Message deleted successfully.");
      await fetchMessages();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete message."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const statusStyle = (value) => {
    const styles = {
      new: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      read: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      replied:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      archived:
        "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    };

    return styles[value] || styles.new;
  };

  const statCards = [
    { label: "Total Messages", value: stats.total, icon: FaEnvelope },
    { label: "New Messages", value: stats.new, icon: FaEnvelopeOpen },
    { label: "Read", value: stats.read, icon: FaEye },
    { label: "Replied", value: stats.replied, icon: FaReply },
    { label: "Archived", value: stats.archived, icon: FaArchive },
  ];

  return (
    <div className="min-h-screen w-full space-y-6 overflow-x-hidden px-1 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Messages
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and respond to website inquiries.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {card.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, subject or message..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4">Sender</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">{item.email}</p>
                    </td>

                    <td className="max-w-xs truncate px-5 py-4 text-slate-700 dark:text-slate-300">
                      {item.subject}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openMessage(item._id)}
                          title="View message"
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={() => deleteMessage(item._id)}
                          title="Delete message"
                          className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-4 w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Message Details
              </h2>

              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-500 hover:text-red-500"
                aria-label="Close message"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {selectedMessage.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="break-all font-medium text-blue-600"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {selectedMessage.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Date received</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500">Subject</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedMessage.subject}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-slate-500">Message</p>
                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {selectedMessage.message}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Admin Notes
                </label>

                <textarea
                  rows="3"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Message Status
                </label>

                <select
                  value={selectedMessage.status}
                  onChange={(e) =>
                    setSelectedMessage((previous) => ({
                      ...previous,
                      status: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  onClick={() => deleteMessage(selectedMessage._id)}
                  disabled={actionLoading}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    Close
                  </button>

                  <button
                    onClick={() =>
                      updateMessage(selectedMessage._id, {
                        status: selectedMessage.status,
                        adminNotes,
                      })
                    }
                    disabled={actionLoading}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
