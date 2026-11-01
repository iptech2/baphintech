
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaGithub,
  FaExternalLinkAlt,
  FaFolderOpen,
  FaCode,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

import api from "../../services/api";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/projects/${id}`);
        setProject(response.data.project);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load project details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const copyCode = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setError("Unable to copy code. Please copy it manually.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="max-w-md text-center">
          <FaFolderOpen className="mx-auto text-5xl text-slate-300" />

          <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            Project Not Available
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {error || "We could not find this project."}
          </p>

          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <FaArrowLeft />
            Back to Projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <section className="bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <FaArrowLeft />
            Back to Projects
          </Link>

          <div className="mt-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
              {project.category}
            </p>

            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
              {project.title}
            </h1>

            <p className="mt-5 max-w-3xl leading-8 text-slate-300">
              {project.shortDescription}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-200"
                >
                  <FaGithub />
                  GitHub Repository
                </a>
              )}

              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <FaExternalLinkAlt />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-12 px-6 py-12">
        {/* Cover image */}
        {project.coverImage && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <img
              src={project.coverImage}
              alt={project.title}
              className="max-h-[550px] w-full object-cover"
            />
          </div>
        )}

        {/* Description and technologies */}
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              About This Project
            </h2>

            <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600 dark:text-slate-300">
              {project.description}
            </p>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Technologies Used
            </h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {(project.technologies || []).map((technology, index) => (
                <span
                  key={`${technology}-${index}`}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </aside>
        </div>

        {/* Features */}
        {project.features?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Key Features
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                    {index + 1}
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Screenshots */}
        {project.screenshots?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Project Screenshots
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {project.screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <img
                    src={screenshot}
                    alt={`${project.title} screenshot ${index + 1}`}
                    loading="lazy"
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Code examples */}
        {project.codeExamples?.length > 0 && (
          <section>
            <div className="mb-7">
              <div className="flex items-center gap-3">
                <FaCode className="text-2xl text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Code Examples
                </h2>
              </div>

              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Explore selected source code from this project.
              </p>
            </div>

            <div className="space-y-6">
              {project.codeExamples.map((example, index) => (
                <div
                  key={example._id || index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {example.title || `Code Example ${index + 1}`}
                      </h3>

                      <p className="mt-1 text-xs uppercase tracking-wider text-blue-600">
                        {example.language}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyCode(example.code, index)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      {copiedIndex === index ? <FaCheck /> : <FaCopy />}
                      {copiedIndex === index ? "Copied" : "Copy Code"}
                    </button>
                  </div>

                  {example.description && (
                    <p className="px-4 pt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {example.description}
                    </p>
                  )}

                  <pre className="max-h-[550px] overflow-auto bg-slate-950 p-5 text-sm leading-6 text-green-300">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom navigation */}
        <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
          >
            <FaArrowLeft />
            Explore More Projects
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;
