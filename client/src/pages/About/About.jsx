import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaCode,
  FaCloud,
  FaDatabase,
  FaMobileAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function About() {
  const skills = [
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "MySQL",
    "Python",
    "Django",
    "Java",
    "Spring Boot",
    "AWS",
    "Docker",
    "Git & GitHub",
  ];

  const highlights = [
    {
      icon: FaCode,
      title: "Software Development",
      description:
        "Building responsive web applications and practical software solutions using modern technologies.",
    },
    {
      icon: FaMobileAlt,
      title: "Application Development",
      description:
        "Developing user-friendly applications designed to solve real-world problems.",
    },
    {
      icon: FaCloud,
      title: "Cloud & Deployment",
      description:
        "Working with cloud platforms, deployment environments and modern application infrastructure.",
    },
    {
      icon: FaDatabase,
      title: "Database Solutions",
      description:
        "Designing and working with databases including MongoDB, MySQL and other data technologies.",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.20),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              About Me
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
              Building technology with purpose.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
              I am Baphin Kipkorir Koskey, a Computer Science graduate and
              software developer passionate about using technology to create
              practical solutions for individuals, businesses and
              organizations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="bg-white px-6 py-24 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Who I Am
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              A developer focused on practical solutions.
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-slate-600 dark:text-slate-400">
              <p>
                I hold a Bachelor of Science in Computer Science from the
                University of Eldoret. My interest in technology goes beyond
                writing code — I enjoy understanding problems and turning ideas
                into useful digital products.
              </p>

              <p>
                My experience covers web development, mobile application
                development, databases, cloud technologies and ICT support. I
                work with modern development tools and technologies to create
                solutions that are reliable, responsive and easy to use.
              </p>

              <p>
                Through Baphin Tech, my goal is to help individuals,
                businesses and organizations make better use of technology by
                providing practical software development and ICT solutions.
              </p>
            </div>
          </motion.div>

          {/* EDUCATION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
              <FaGraduationCap size={26} />
            </div>

            <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Education
            </p>

            <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              Bachelor of Science in Computer Science
            </h3>

            <p className="mt-3 font-medium text-slate-700 dark:text-slate-300">
              University of Eldoret
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Graduated — November 2024
            </p>

            <div className="mt-7 border-t border-slate-200 pt-6 dark:border-slate-800">
              <p className="leading-7 text-slate-600 dark:text-slate-400">
                Academic training in software development, computer systems,
                databases, networking, algorithms and information technology.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="bg-slate-50 px-6 py-24 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              What I Do
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Technology skills that create value.
            </h2>

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              I combine software development skills with an understanding of
              business and user needs to build useful digital solutions.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="bg-white px-6 py-24 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Technical Skills
            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
              Technologies I work with
            </h2>
          </div>

          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <FaCheckCircle className="text-blue-600" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Let's build something useful.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Have an idea, project or technology challenge? Let's discuss how I
            can help turn it into a practical digital solution.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 shadow-xl transition hover:-translate-y-1"
          >
            Let's Work Together
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;