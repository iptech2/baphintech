
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function BlogDetails() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");
        setBlog(null);

        const response = await api.get(
          `/blogs/${encodeURIComponent(slug)}`
        );

        const result = response.data;

        const article =
          result?.blog ||
          result?.data ||
          result?.article ||
          result;

        if (!article || !article.title) {
          throw new Error("Article not found");
        }

        setBlog(article);
      } catch (err) {
        console.error("Failed to load article:", err);
        setError("Article not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  // SEO and social sharing metadata
  useEffect(() => {
    if (!blog) return;

    const previousTitle = document.title;
    const previousMeta = [];

    const updateMeta = (attribute, key, content) => {
      let element = document.head.querySelector(
        `meta[${attribute}="${key}"]`
      );

      const existed = Boolean(element);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      previousMeta.push({
        element,
        existed,
        previousContent: element.getAttribute("content"),
      });

      element.setAttribute("content", content);
    };

    const pageTitle = blog.seoTitle || blog.title;
    const pageDescription =
      blog.seoDescription || blog.excerpt || "";
    const socialImage =
      blog.socialImage || blog.featuredImage || "";

    document.title = `${pageTitle} | Baphin Tech`;

    // Standard SEO metadata
    updateMeta("name", "description", pageDescription);

    // Open Graph metadata
    updateMeta("property", "og:type", "article");
    updateMeta("property", "og:title", pageTitle);
    updateMeta("property", "og:description", pageDescription);
    updateMeta("property", "og:url", window.location.href);

    if (socialImage) {
      updateMeta("property", "og:image", socialImage);
    }

    updateMeta("property", "og:site_name", "Baphin Tech");

    // Twitter metadata
    updateMeta(
      "name",
      "twitter:card",
      socialImage ? "summary_large_image" : "summary"
    );
    updateMeta("name", "twitter:title", pageTitle);
    updateMeta("name", "twitter:description", pageDescription);

    if (socialImage) {
      updateMeta("name", "twitter:image", socialImage);
    }

    return () => {
      document.title = previousTitle;

      previousMeta.forEach(
        ({ element, existed, previousContent }) => {
          if (existed) {
            if (previousContent === null) {
              element.removeAttribute("content");
            } else {
              element.setAttribute("content", previousContent);
            }
          } else {
            element.remove();
          }
        }
      );
    };
  }, [blog]);

  const shareArticle = async () => {
    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Article link copied!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Sharing failed:", err);
      }
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-white px-6 py-24 dark:bg-slate-900">
        <p className="text-center text-slate-500">
          Loading article...
        </p>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="min-h-screen bg-white px-6 py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Article unavailable
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            {error}
          </p>

          <Link
            to="/blog"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="min-h-screen bg-white px-6 py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Blog
        </Link>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            {blog.category || "Technology"}
          </p>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl dark:text-white">
            {blog.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span>By {blog.author || "Baphin Tech"}</span>

            {blog.publishedAt && (
              <span>
                {new Date(blog.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {blog.featuredImage && (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="mt-10 max-h-[500px] w-full rounded-2xl object-cover"
            />
          )}

          <p className="mt-10 text-lg leading-9 text-slate-600 dark:text-slate-300">
            {blog.excerpt}
          </p>

          <div className="mt-8 whitespace-pre-line break-words text-base leading-9 text-slate-700 dark:text-slate-300">
            {blog.content}
          </div>

          {blog.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-700">
            <button
              onClick={shareArticle}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Share Article
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogDetails;
