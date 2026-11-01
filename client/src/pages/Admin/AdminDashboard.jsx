
import {
  FaUsers,
  FaFolderOpen,
  FaCode,
  FaEnvelope,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const statistics = [
  {
    title: "Registered Users",
    value: "Manage",
    icon: FaUsers,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Projects",
    value: "Manage",
    icon: FaFolderOpen,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Code Snippets",
    value: "Manage",
    icon: FaCode,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Messages",
    value: "Manage",
    icon: FaEnvelope,
    color: "bg-orange-100 text-orange-600",
  },
];

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard Overview
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Welcome to your Baphin Tech management centre.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-4 ${item.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/projects"
            className="flex items-center justify-between rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <FaPlus className="text-blue-600" />
              <span className="font-semibold text-slate-800 dark:text-white">
                Add New Project
              </span>
            </div>
            <FaArrowRight className="text-slate-400" />
          </Link>

          <Link
            to="/admin/code-library"
            className="flex items-center justify-between rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <FaPlus className="text-blue-600" />
              <span className="font-semibold text-slate-800 dark:text-white">
                Add Code Snippet
              </span>
            </div>
            <FaArrowRight className="text-slate-400" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
