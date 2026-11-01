import { motion } from "framer-motion";
import {
  FaProjectDiagram,
  FaUser,
  FaComments,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Dashboard() {
  const stats = [
    {
      title: "My Projects",
      value: "0",
      icon: FaProjectDiagram,
      link: "/projects",
    },
    {
      title: "Profile",
      value: "View",
      icon: FaUser,
      link: "/profile",
    },
    {
      title: "Consultations",
      value: "0",
      icon: FaComments,
      link: "/contact",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Welcome to Baphin Tech
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Manage your profile, projects and consultation requests from your
            dashboard.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={stat.link}
                  className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      <Icon size={20} />
                    </div>

                    <FaArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  </div>

                  <h2 className="mt-6 font-semibold text-slate-900 dark:text-white">
                    {stat.title}
                  </h2>

                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    {stat.value}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/profile"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Manage Profile
            </Link>

            <Link
              to="/projects"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200"
            >
              View Projects
            </Link>

            <Link
              to="/contact"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;