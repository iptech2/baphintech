
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFolderOpen,
  FaCode,
  FaBlog,
  FaBriefcase,
  FaUsers,
  FaEnvelope,
  FaComments,
  FaGlobe,
  FaCog,
  FaExternalLinkAlt,
  FaTimes,
} from "react-icons/fa";

const menuItems = [
  { name: "Overview", path: "/admin", icon: FaTachometerAlt, end: true },
  { name: "Projects", path: "/admin/projects", icon: FaFolderOpen },
  { name: "Code Library", path: "/admin/code-library", icon: FaCode },
  { name: "Blog", path: "/admin/blog", icon: FaBlog },
  { name: "Services", path: "/admin/services", icon: FaBriefcase },
  { name: "Users", path: "/admin/users", icon: FaUsers },
  { name: "Messages", path: "/admin/messages", icon: FaEnvelope },
  { name: "Consultations", path: "/admin/consultations", icon: FaComments },
  { name: "Website Content", path: "/admin/content", icon: FaGlobe },
  { name: "Settings", path: "/admin/settings", icon: FaCog },
];

function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div>
            <h2 className="text-xl font-bold tracking-wide">
              Baphin <span className="text-blue-500">Tech</span>
            </h2>
            <p className="mt-1 text-xs text-slate-400">Administration Panel</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={17} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <FaExternalLinkAlt />
            View Website
          </a>

          <p className="mt-3 px-4 text-xs text-slate-600">
            Baphin Tech © 2026
          </p>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
