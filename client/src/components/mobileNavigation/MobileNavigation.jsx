import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaProjectDiagram,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaEllipsisH,
  FaTimes,
  FaInfoCircle,
  FaBriefcase,
  FaBlog,
  FaEnvelope,
} from "react-icons/fa";

function MobileNavigation() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainLinks = [
    {
      name: "Home",
      path: "/",
      icon: FaHome,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FaProjectDiagram,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: FaUser,
    },
  ];

  const moreLinks = [
    {
      name: "About",
      path: "/about",
      icon: FaInfoCircle,
    },
    {
      name: "Services",
      path: "/services",
      icon: FaBriefcase,
    },
    {
      name: "Blog",
      path: "/blog",
      icon: FaBlog,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: FaEnvelope,
    },
  ];

  return (
    <>
      {/* MORE MENU OVERLAY */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* MORE SIDEBAR */}
      <div
        className={`fixed right-0 top-0 z-[100] h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-950 lg:hidden ${
          isMoreOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              Baphin<span className="text-blue-600">Tech</span>
            </p>

            <p className="text-xs text-slate-500">Menu</p>
          </div>

          <button
            onClick={() => setIsMoreOpen(false)}
            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-4 py-5">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </p>

          <div className="mt-3 space-y-1">
            {moreLinks.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40"
                        : "text-slate-700 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-900"
                    }`
                  }
                >
                  <Icon size={17} />
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <div className="mt-3 space-y-1">
            <Link
              to="/login"
              onClick={() => setIsMoreOpen(false)}
              className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <FaSignInAlt size={17} />
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setIsMoreOpen(false)}
              className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <FaUserPlus size={17} />
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* FIXED MOBILE BOTTOM NAVIGATION */}
<nav
  className="
    fixed
    bottom-0
    left-0
    right-0
    z-[9999]
    w-full
    border-t
    border-slate-200
    bg-white
    px-2
    pt-2
    pb-[calc(0.5rem+env(safe-area-inset-bottom))]
    shadow-[0_-5px_20px_rgba(0,0,0,0.08)]
    dark:border-slate-800
    dark:bg-slate-950
    lg:hidden
  "
>
  <div className="mx-auto flex w-full max-w-md items-center justify-around">
    
    {/* Dashboard */}
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        `flex h-12 w-16 items-center justify-center rounded-xl transition ${
          isActive
            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
            : "text-slate-500 dark:text-slate-400"
        }`
      }
      aria-label="Dashboard"
    >
      <FaHome size={21} />
    </NavLink>

    {/* Projects */}
    <NavLink
      to="/projects"
      className={({ isActive }) =>
        `flex h-12 w-16 items-center justify-center rounded-xl transition ${
          isActive
            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
            : "text-slate-500 dark:text-slate-400"
        }`
      }
      aria-label="Projects"
    >
      <FaProjectDiagram size={21} />
    </NavLink>

    {/* Profile */}
    <NavLink
      to="/profile"
      className={({ isActive }) =>
        `flex h-12 w-16 items-center justify-center rounded-xl transition ${
          isActive
            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
            : "text-slate-500 dark:text-slate-400"
        }`
      }
      aria-label="Profile"
    >
      <FaUser size={21} />
    </NavLink>

    {/* Login */}
    <NavLink
      to="/login"
      className={({ isActive }) =>
        `flex h-12 w-16 items-center justify-center rounded-xl transition ${
          isActive
            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
            : "text-slate-500 dark:text-slate-400"
        }`
      }
      aria-label="Login"
    >
      <FaSignInAlt size={21} />
    </NavLink>

    {/* More */}
    <button
      onClick={() => setIsMoreOpen(true)}
      className="flex h-12 w-16 items-center justify-center rounded-xl text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
      aria-label="More menu"
    >
      <FaEllipsisH size={22} />
    </button>

  </div>
</nav>
    </>
  );
}

export default MobileNavigation;