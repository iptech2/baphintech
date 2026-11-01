
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
  FaFolderOpen,
  FaSearch,
} from "react-icons/fa";

import api from "../../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/projects");
        setProjects(response.data.projects || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load projects. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category).filter(Boolean)),
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(search.toLowerCase()) ||
      project.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
      project.technologies?.some((technology) =>
        technology.toLowerCase().includes(search.toLowerCase())
      );

    const matchesCategory =
      category === "All" || project.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white sm:py-28">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-400">
            Our Portfolio
          </p>

          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Projects That Turn
            <span className="block text-blue-500">
              Ideas Into Reality
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore our software development projects, digital solutions
            and technology innovations.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Our Work
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                Featured Projects
              </h2>

              <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
                Discover some of the solutions we have designed and developed.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="mb-10 flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="mt-4 text-sm text-slate-500">
                Loading projects...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Project cards */}
          {!loading && !error && filteredProjects.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <article
                  key={project._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FaFolderOpen className="text-5xl text-slate-300" />
                      </div>
                    )}

                    {project.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {project.category}
                    </span>

                    <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                      {project.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {project.shortDescription}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {(project.technologies || []).slice(0, 4).map(
                        (technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {technology}
                          </span>
                        )
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                      <Link
                        to={`/projects/${project._id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                      >
                        View Details
                        <FaArrowRight />
                      </Link>

                      <div className="flex items-center gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub repository"
                            className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
                          >
                            <FaGithub size={18} />
                          </a>
                        )}

                        {project.liveDemoUrl && (
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Live project demo"
                            className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
                          >
                            <FaExternalLinkAlt size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
              <FaFolderOpen className="mx-auto text-5xl text-slate-300" />

              <h3 className="mt-5 text-xl font-bold text-slate-800 dark:text-white">
                No Projects Found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search or category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Projects;
