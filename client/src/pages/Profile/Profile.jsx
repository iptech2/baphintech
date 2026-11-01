import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
} from "react-icons/fa";

function Profile() {
  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            My Profile
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-400">
            View and manage your Baphin Tech account information.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Profile header */}
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl text-white">
              <FaUser />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                User Profile
              </h2>

              <p className="text-sm text-slate-500">
                Baphin Tech Member
              </p>
            </div>

            <button className="sm:ml-auto flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <FaEdit />
              Edit Profile
            </button>
          </div>

          {/* Information */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950">
              <div className="flex items-center gap-3 text-blue-600">
                <FaUser />
                <span className="text-sm font-semibold">Full Name</span>
              </div>

              <p className="mt-3 text-slate-700 dark:text-slate-300">
                Your Name
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950">
              <div className="flex items-center gap-3 text-blue-600">
                <FaEnvelope />
                <span className="text-sm font-semibold">Email</span>
              </div>

              <p className="mt-3 text-slate-700 dark:text-slate-300">
                your@email.com
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950">
              <div className="flex items-center gap-3 text-blue-600">
                <FaPhone />
                <span className="text-sm font-semibold">Phone</span>
              </div>

              <p className="mt-3 text-slate-700 dark:text-slate-300">
                Not provided
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Profile;