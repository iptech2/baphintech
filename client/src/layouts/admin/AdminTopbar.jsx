
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function AdminTopbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <FaBars size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your Baphin Tech website
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <FaBell size={18} />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-700">
          <FaUserCircle className="text-3xl text-blue-600" />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.name || "Administrator"}
            </p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
