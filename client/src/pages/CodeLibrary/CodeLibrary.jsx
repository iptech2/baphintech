
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaSearch,
  FaCopy,
  FaCheck,
  FaArrowLeft,
  FaTimes,
  FaFolderOpen,
} from "react-icons/fa";

import api from "../../services/api";

function CodeLibrary() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/code-library");
        setSnippets(response.data.snippets || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load the Code Library. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const languages = useMemo(() => {
    const uniqueLanguages = [
      ...new Set(snippets.map((snippet) => snippet.language).filter(Boolean)),
    ];

    return ["All", ...uniqueLanguages.sort()];
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      const searchText = search.toLowerCase();

      const matchesSearch = [
        snippet.title,
        snippet.description,
        snippet.language,
        snippet.category,
        ...(snippet.technologies || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchText);

      const matchesLanguage =
        selectedLanguage === "All" ||
        snippet.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [snippets, search, selectedLanguage]);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy code. Please copy it manually.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <FaArrowLeft />
            Back to Projects
          </Link>

          <div className="mt-10 max-w-3xl">
            <div className="flex items-center gap-3 text-blue-400">
              <FaCode className="text-3xl" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Developer Resources
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">
              Baphin Tech Code Library
            </h1>

            <p className="mt-5 leading-8 text-slate-300">
              Explore reusable source code, programming examples and
              practical development resources. Learn, copy and build
              better applications.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-4 text-sm text-slate-300">
            <span className="rounded-lg bg-white/10 px-4 py-2">
              {snippets.length} Published Snippets
            </span>
            <span className="rounded-lg bg-white/10 px-4 py-2">
              {Math.max(languages.length - 1, 0)} Languages
            </span>
          </div>
        </div>
      </section>

      {/* Library */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Explore Code Snippets
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Find code examples for your next development project.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <div className="relative w-full sm:min-w-[260px]">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search code..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language === "All" ? "All Languages" : language}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="mt-4 text-sm text-slate-500">
                Loading Code Library...
              </p>
            </div>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
            <FaFolderOpen className="mx-auto text-5xl text-slate-300" />

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              No Code Snippets Found
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              {snippets.length === 0
                ? "There are no published snippets yet. Please check again later."
                : "Try another search term or programming language."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSnippets.map((snippet) => (
              <article
                key={snippet._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {snippet.language}
                  </span>

                  <span className="text-xs text-slate-400">
                    {snippet.category || "General"}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  {snippet.title}
                </h3>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {snippet.description}
                </p>

                {snippet.technologies?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {snippet.technologies.slice(0, 4).map((technology, index) => (
                      <span
                        key={`${technology}-${index}`}
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSnippet(snippet);
                    setCopied(false);
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <FaCode />
                  View Code
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Code viewer modal */}
      {selectedSnippet && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setSelectedSnippet(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {selectedSnippet.language}
                </span>

                <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  {selectedSnippet.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {selectedSnippet.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSnippet(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close code viewer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500">
                SOURCE CODE
              </span>

              <button
                type="button"
                onClick={() => copyCode(selectedSnippet.code)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? "Copied" : "Copy Code"}
              </button>
            </div>

            <div className="overflow-auto bg-slate-950 p-5">
              <pre className="min-w-0 whitespace-pre-wrap break-words text-sm leading-7 text-green-300">
                <code>{selectedSnippet.code}</code>
              </pre>
            </div>

            {selectedSnippet.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
                {selectedSnippet.technologies.map((technology, index) => (
                  <span
                    key={`${technology}-${index}`}
                    className="rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeLibrary;
