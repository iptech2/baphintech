import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCode,
  FaMobileAlt,
  FaCloud,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";

function Home() {
  const services = [
    {
      icon: FaCode,
      title: "Web Development",
      description:
        "Modern, responsive and scalable websites and web applications built around your goals.",
    },
    {
      icon: FaMobileAlt,
      title: "Mobile Development",
      description:
        "Cross-platform mobile applications designed to provide smooth experiences on different devices.",
    },
    {
      icon: FaCloud,
      title: "Cloud Solutions",
      description:
        "Cloud deployment, infrastructure and application solutions using modern cloud technologies.",
    },
    {
      icon: FaLightbulb,
      title: "ICT Consultation",
      description:
        "Practical technology advice to help businesses and organizations choose and implement the right solutions.",
    },
  ];

  const technologies = [
    "React",
    "Node.js",
    "MongoDB",
    "MySQL",
    "Python",
    "Django",
    "Java",
    "Spring Boot",
    "AWS",
    "Docker",
  ];

 return (
  <div>
    {/* <div className="bg-yellow-400 p-4 text-center font-bold text-black">
      HOME COMPONENT IS WORKING
    </div> */}

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.20),transparent_35%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-24">

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Available for ICT projects
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Building Digital
              <span className="block text-blue-500">
                Solutions
              </span>
              That Make an Impact.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              I'm Baphin Kipkorir Koskey, a Computer Science graduate and
              software developer passionate about building practical,
              scalable and user-friendly technology solutions.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                to="/projects"
                className="group inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                Explore My Work
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/contact"
                className="rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-white transition hover:border-blue-500 hover:bg-slate-900"
              >
                Let's Work Together
              </Link>

            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-500" />
                Responsive Solutions
              </span>

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-500" />
                Modern Technologies
              </span>

              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-500" />
                Client Focused
              </span>

            </div>

          </motion.div>

          {/* Code Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-2xl shadow-blue-950/30">

              <div className="rounded-xl border border-slate-800 bg-slate-950">

                <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />

                  <span className="ml-4 text-xs text-slate-500">
                    baphin-tech.jsx
                  </span>
                </div>

                <div className="p-7 font-mono text-sm leading-8">

                  <p className="text-slate-500">
                    // Building the future with technology
                  </p>

                  <p className="mt-3">
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">developer</span>{" "}
                    = {"{"}
                  </p>

                  <p className="pl-6">
                    name: <span className="text-green-400">"Baphin"</span>,
                  </p>

                  <p className="pl-6">
                    role:{" "}
                    <span className="text-green-400">
                      "Software Developer"
                    </span>
                    ,
                  </p>

                  <p className="pl-6">
                    passion:{" "}
                    <span className="text-green-400">
                      "Technology"
                    </span>
                    ,
                  </p>

                  <p className="pl-6">
                    focus:{" "}
                    <span className="text-green-400">
                      "Real World Solutions"
                    </span>
                  </p>

                  <p>{"}"}</p>

                  <p className="mt-5">
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-blue-400">
                      createSolution
                    </span>
                    ();
                  </p>

                  <div className="mt-6 rounded-lg bg-blue-500/10 p-4 text-blue-400">
                    ✓ Ready to build something great.
                  </div>

                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="bg-white py-24 dark:bg-slate-900">

        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              What I Do
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Technology solutions built for real needs.
            </h2>

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              From websites and mobile applications to cloud infrastructure
              and ICT consulting, I help turn ideas into working digital
              solutions.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900 dark:hover:shadow-none"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {service.description}
                  </p>

                  <Link
                    to="/services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
                  >
                    Learn more
                    <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                  </Link>

                </motion.div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ================= TECHNOLOGIES ================= */}
      <section className="bg-slate-50 py-20 dark:bg-slate-950">

        <div className="mx-auto max-w-7xl px-6 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Technology Stack
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Tools I use to build solutions
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-3">

            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                {technology}
              </span>
            ))}

          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-blue-600 py-20 text-white">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Have a technology idea?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Whether you need a website, application, cloud solution or ICT
            consultation, let's discuss how technology can help you achieve
            your goals.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 shadow-xl transition hover:-translate-y-1"
          >
            Start a Conversation
            <FaArrowRight />
          </Link>

        </div>    
          </section>
    </div>
  );
}

export default Home;