
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const ARTICLES_PER_PAGE = 6;

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/blogs");
        const result = response.data;

        const articles = Array.isArray(result)
          ? result
          : Array.isArray(result.blogs)
          ? result.blogs
          : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.articles)
          ? result.articles
          : [];

        setBlogs(articles);
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setError("Unable to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(blogs.map((blog) => blog.category).filter(Boolean)),
    ];

    return ["All", ...uniqueCategories];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        blog.title?.toLowerCase().includes(searchText) ||
        blog.excerpt?.toLowerCase().includes(searchText) ||
        blog.content?.toLowerCase().includes(searchText) ||
        blog.tags?.some((tag) =>
          tag.toLowerCase().includes(searchText)
        );

      const matchesCategory =
        selectedCategory === "All" ||
        blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, search, selectedCategory]);

  // Only display an article explicitly marked as featured.
  // Hide the featured section while searching or filtering categories.
  const featuredBlog =
    !search.trim() && selectedCategory === "All"
      ? filteredBlogs.find((blog) => blog.isFeatured === true)
      : null;

  // Remove the featured article from the normal articles grid.
  const remainingBlogs = featuredBlog
    ? filteredBlogs.filter((blog) => blog._id !== featuredBlog._id)
    : filteredBlogs;

  const totalPages = Math.ceil(
    remainingBlogs.length / ARTICLES_PER_PAGE
  );

  const paginatedBlogs = remainingBlogs.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setCurrentPage(1);
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
          Baphin Tech Blog
        </p>

        <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
          Technology & Insights
        </h1>

        <p className="mt-6 max-w-3xl leading-8 text-slate-600 dark:text-slate-400">
          Explore articles, technology insights, development tips and practical
          ideas about software and ICT.
        </p>

        {/* Search */}
        <div className="mt-12 grid gap-4 md:grid-cols-[1fr_260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, topics or keywords..."
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "All" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading
              ? "Loading articles..."
              : `${filteredBlogs.length} articles found`}
          </p>

          {(search || selectedCategory !== "All") && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <p className="py-16 text-center text-slate-500">
            Loading articles...
          </p>
        ) : error ? (
          <div className="mt-10 rounded-xl bg-red-50 p-6 text-red-600">
            {error}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 p-10 text-center dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              No articles found
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Try another search term or category.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredBlog && (
              <div className="mt-12">
                <p className="mb-5 text-sm font-bold uppercase tracking-widest text-blue-600">
                  Featured Article
                </p>

                <article className="grid overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 md:grid-cols-2 dark:border-slate-700 dark:bg-slate-800">
                  {featuredBlog.featuredImage ? (
                    <img
                      src={featuredBlog.featuredImage}
                      alt={featuredBlog.title}
                      className="h-72 w-full object-cover md:h-full"
                    />
                  ) : (
                    <div className="flex min-h-72 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900">
                      <span className="text-4xl font-bold text-white">
                        Baphin Tech
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <p className="font-semibold text-blue-600">
                      {featuredBlog.category || "Technology"}
                    </p>

                    <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                      {featuredBlog.title}
                    </h2>

                    <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">
                      {featuredBlog.excerpt}
                    </p>

                    <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                      By {featuredBlog.author || "Baphin Tech"}
                    </p>

                    <Link
                      to={`/blog/${featuredBlog.slug}`}
                      className="mt-7 inline-flex w-fit rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      Read Featured Article →
                    </Link>
                  </div>
                </article>
              </div>
            )}

            {/* Articles Grid */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {featuredBlog ? "More Articles" : "Articles"}
              </h2>

              {paginatedBlogs.length === 0 ? (
                <p className="mt-6 text-slate-500 dark:text-slate-400">
                  No additional articles to display.
                </p>
              ) : (
                <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedBlogs.map((blog) => (
                    <article
                      key={blog._id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
                    >
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="h-52 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-52 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
                          <span className="text-3xl font-bold text-white">
                            Baphin Tech
                          </span>
                        </div>
                      )}

                      <div className="p-6">
                        <p className="text-sm font-semibold text-blue-600">
                          {blog.category || "Technology"}
                        </p>

                        <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                          {blog.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 leading-7 text-slate-600 dark:text-slate-400">
                          {blog.excerpt}
                        </p>

                        <div className="mt-5 flex justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span>{blog.author || "Baphin Tech"}</span>
                          <span>
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString()
                              : ""}
                          </span>
                        </div>

                        <Link
                          to={`/blog/${blog.slug}`}
                          className="mt-6 inline-flex font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Read Article →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-4 py-3 font-semibold ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Blog;
