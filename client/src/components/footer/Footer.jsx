import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaArrowUp,
} from "react-icons/fa";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">

      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              Baphin<span className="text-blue-600">Tech</span>
            </Link>

            <p className="mt-5 max-w-md leading-7 text-slate-600 dark:text-slate-400">
              Building modern digital solutions that help individuals,
              businesses and organizations solve real-world problems through
              technology.
            </p>

            <div className="mt-6 flex gap-3">

              <a
                href="https://github.com/iptech2"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/baphinkoskey"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a
                href="mailto:koskeybaphin1@gmail.com"
                className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>

            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Navigation
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/projects"
                  className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400"
                >
                  Projects
                </Link>
              </li>

              <li>
                <Link
                  to="/blog"
                  className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Services
            </h3>

            <ul className="mt-5 space-y-3">
              <li className="text-sm text-slate-600 dark:text-slate-400">
                Web Development
              </li>

              <li className="text-sm text-slate-600 dark:text-slate-400">
                Mobile Development
              </li>

              <li className="text-sm text-slate-600 dark:text-slate-400">
                Cloud Solutions
              </li>

              <li className="text-sm text-slate-600 dark:text-slate-400">
                ICT Consultation
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-14 flex flex-col justify-between gap-5 border-t border-slate-200 pt-8 dark:border-slate-800 md:flex-row md:items-center">

          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} Baphin Tech. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to top
            <FaArrowUp />
          </button>

        </div>

      </div>
    </footer>
  );
}

export default Footer;