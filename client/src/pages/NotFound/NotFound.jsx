import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 py-20 dark:bg-slate-950">
      <div className="text-center">
        <p className="text-8xl font-bold text-blue-600">404</p>

        <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600 dark:text-slate-400">
          Sorry, the page you are looking for does not exist or may have been
          moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <FaArrowLeft />
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;