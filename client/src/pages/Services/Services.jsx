
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCode,
  FiSmartphone,
  FiCloud,
  FiMonitor,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

import api from "../../services/api";

const iconMap = {
  "web development": FiCode,
  "mobile development": FiSmartphone,
  "cloud solutions": FiCloud,
  "ict consultation": FiMonitor,
};

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.services || []);
      } catch (err) {
        console.error("Services loading error:", err);
        setError("Unable to load services at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-semibold uppercase tracking-widest text-green-400">
            What We Offer
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Our Services
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-gray-300">
            We provide innovative technology solutions that help
            individuals and businesses grow, connect and succeed
            in the digital world.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading our services...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Services coming soon
            </h2>
            <p className="mt-2 text-gray-500">
              We are preparing our services. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon =
                iconMap[service.title?.toLowerCase()] || FiCode;

              return (
                <article
                  key={service._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-7">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-2xl text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      <Icon />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h2>

                    <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
                      {service.shortDescription}
                    </p>

                    {service.features?.length > 0 && (
                      <ul className="mt-5 space-y-2">
                        {service.features.map((feature, index) => (
                          <li
                            key={`${service._id}-feature-${index}`}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                          >
                            <FiCheckCircle className="mt-1 shrink-0 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    {service.technologies?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {service.technologies.map((technology, index) => (
                          <span
                            key={`${service._id}-tech-${index}`}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      to="/contact"
                      className="mt-7 inline-flex items-center gap-2 font-semibold text-green-600 transition hover:gap-3 hover:text-green-700"
                    >
                      Request This Service
                      <FiArrowRight />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Call to action */}
      <section className="bg-green-700 px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">
          Have a Project in Mind?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-green-100">
          Let's discuss how Baphin Tech can help bring your ideas
          to life through technology.
        </p>

        <Link
          to="/contact"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-gray-100"
        >
          Contact Us
          <FiArrowRight />
        </Link>
      </section>
    </div>
  );
}

export default Services;
