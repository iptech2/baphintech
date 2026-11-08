
import { useEffect, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";

import api from "../../../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    admins: 0,
  });

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) params.search = search.trim();
      if (role) params.role = role;
      if (status) params.status = status;

      const response = await api.get("/admin/users", { params });

      setUsers(response.data.users || []);
      setStats(
        response.data.stats || {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          admins: 0,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, role, status]);

  const handleStatusChange = async (user) => {
    const newStatus = !user.isActive;

    const confirmed = window.confirm(
      `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } ${user.name}'s account?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);
      setError("");
      setSuccess("");

      await api.patch(`/admin/users/${user._id}/status`, {
        isActive: newStatus,
      });

      setSuccess(
        `${user.name}'s account ${
          newStatus ? "activated" : "deactivated"
        } successfully.`
      );

      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update account status."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRoleChange = async (user, newRole) => {
    if (newRole === user.role) return;

    const confirmed = window.confirm(
      `Are you sure you want to change ${user.name}'s role to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);
      setError("");
      setSuccess("");

      await api.patch(`/admin/users/${user._id}/role`, {
        role: newRole,
      });

      setSuccess(`${user.name}'s role updated successfully.`);

      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update user role."
      );
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full space-y-6 overflow-x-hidden px-1 pb-10">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage registered users, account status and permissions.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <FiRefreshCw
            className={loading ? "animate-spin" : ""}
          />
          Refresh
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

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Users</p>
            <FiUsers className="text-xl text-blue-600" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalUsers}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Active Users</p>
            <FiUserCheck className="text-xl text-green-600" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-green-600">
            {stats.activeUsers}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Inactive Users</p>
            <FiUserX className="text-xl text-red-500" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-red-500">
            {stats.inactiveUsers}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Administrators</p>
            <FiShield className="text-xl text-purple-600" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-purple-600">
            {stats.admins}
          </h2>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="grid gap-4 md:grid-cols-3">

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or phone..."
              className="w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none focus:border-green-600 dark:border-gray-700 dark:text-white"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-green-600 dark:border-gray-700 dark:text-white"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-green-600 dark:border-gray-700 dark:text-white"
          >
            <option value="">All Account Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">

        <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Registered Users
          </h2>

          <span className="text-sm text-gray-500">
            {users.length} records
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <FiUsers className="mx-auto mb-3 text-3xl text-gray-400" />

            <p className="font-medium text-gray-700 dark:text-gray-200">
              No users found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">

              <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id}>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            <FiUser size={18} />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {user.phone || "Not provided"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={user.role}
                          disabled={actionLoading === user._id}
                          onChange={(e) =>
                            handleRoleChange(user, e.target.value)
                          }
                          className="appearance-none rounded-full border-0 bg-purple-100 py-1 pl-3 pr-7 text-xs font-semibold text-purple-700 outline-none disabled:opacity-50 dark:bg-purple-900/40 dark:text-purple-300"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>

                        <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-purple-700" />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleStatusChange(user)}
                        disabled={actionLoading === user._id}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                          user.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {actionLoading === user._id
                          ? "Updating..."
                          : user.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
}

export default Users;
