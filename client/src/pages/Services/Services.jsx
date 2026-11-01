import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCode,
  FaMobileAlt,
  FaCloud,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa";

function Services() {
  const services = [
    {
      icon: FaCode,
      title: "Web Development",
      description:
        "Modern, responsive and scalable websites and web applications designed around your business or organization needs.",
    },
    {
      icon: FaMobileAlt,
      title: "Mobile Development",
      description:
        "Cross-platform mobile applications that provide smooth and user-friendly experiences across different devices.",
    },
    {
      icon: FaCloud,
      title: "Cloud Solutions",
      description:
        "Cloud deployment, application hosting and infrastructure solutions using modern cloud technologies.",
    },
    {
      icon: FaLightbulb,
      title: "ICT Consultation",
      description:
        "Practical technology advice to help individuals, businesses and organizations choose and implement the right solutions.",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            What I Offer
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Technology Services
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            I provide practical digital solutions that help individuals,
            businesses and organizations use technology to solve real-world
            problems.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <Icon size={24} />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                  {service.title}
                </h2>

                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                  {service.description}
                </p>

                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Discuss a project
                  <FaArrowRight className="text-sm transition group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl bg-blue-600 px-8 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">
            Have a technology challenge?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Let's discuss your idea and find a practical technology solution
            that fits your needs.
          </p>

          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:-translate-y-1"
          >
            Get in Touch
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Services;