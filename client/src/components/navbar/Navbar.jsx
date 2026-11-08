
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import api from "../../services/api";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [settings, setSettings] = useState({
    siteName: "BONETECH",
    siteLogo: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");

        if (response.data?.settings) {
          setSettings((prev) => ({
            ...prev,
            ...response.data.settings,
          }));
        }
      } catch (error) {
        console.error("Failed to load website settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("baphin-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("baphin-theme", "light");
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* BONETECH Branding */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          {settings.siteLogo ? (
            <img
              src={settings.siteLogo}
              alt="BONETECH logo"
              className="h-10 w-10 rounded-xl object-contain"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20 transition group-hover:scale-105">
              B
            </span>
          )}

          <span className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {settings.siteName || "BONETECH"}
            </span>
            <span className="text-[9px] font-semibold tracking-[0.18em] text-blue-600 dark:text-blue-400">
              INNOVATE • DEVELOP • TRANSFORM
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={toggleDarkMode}
            className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>

          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={toggleMenu}
          className="rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="my-3 border-t border-slate-200 dark:border-slate-800" />

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <Link
              to="/login"
              onClick={closeMenu}
              className="mt-2 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold dark:border-slate-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
