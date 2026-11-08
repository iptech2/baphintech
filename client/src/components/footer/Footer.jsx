
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaArrowUp,
  FaFacebookF,
  FaWhatsapp,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import api from "../../services/api";

function Footer() {
  const [settings, setSettings] = useState({
    siteName: "BONETECH",
    siteDescription:
      "Building modern digital solutions that help individuals, businesses and organizations solve real-world problems through technology.",
    contactEmail: "koskeybaphin1@gmail.com",
    contactPhone: "",
    address: "",
    socialLinks: {},
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");

        if (response.data?.settings) {
          setSettings((prev) => ({
            ...prev,
            ...response.data.settings,
            socialLinks: {
              ...prev.socialLinks,
              ...(response.data.settings.socialLinks || {}),
            },
          }));
        }
      } catch (error) {
        console.error("Failed to load footer settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    {
      name: "Facebook",
      url: settings.socialLinks?.facebook,
      icon: <FaFacebookF />,
    },
    {
      name: "TikTok",
      url: settings.socialLinks?.tiktok,
      icon: <FaTiktok />,
    },
    {
      name: "WhatsApp",
      url: settings.socialLinks?.whatsapp,
      icon: <FaWhatsapp />,
    },
    {
      name: "GitHub",
      url: settings.socialLinks?.github || "https://github.com/iptech2",
      icon: <FaGithub />,
    },
    {
      name: "LinkedIn",
      url:
        settings.socialLinks?.linkedin ||
        "https://www.linkedin.com/in/baphinkoskey",
      icon: <FaLinkedin />,
    },
    {
      name: "Email",
      url: settings.contactEmail
        ? `mailto:${settings.contactEmail}`
        : "",
      icon: <FaEnvelope />,
      email: true,
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
              {settings.siteName || "BONETECH"}
              <span className="text-blue-600">.</span>
            </Link>

            <p className="mt-2 text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400">
              BAPHIN OPEN NETWORK ENTREPRENEUR
            </p>

            <p className="mt-5 max-w-md leading-7 text-slate-600 dark:text-slate-400">
              {settings.siteDescription}
            </p>

            {/* Social Media */}
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks
                .filter((item) => item.url)
                .map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target={item.email ? undefined : "_blank"}
                    rel={item.email ? undefined : "noreferrer"}
                    aria-label={item.name}
                    title={item.name}
                    className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400"
                  >
                    {item.icon}
                  </a>
                ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Navigation
            </h3>

            <ul className="mt-5 space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Projects", path: "/projects" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Services
            </h3>

            <ul className="mt-5 space-y-3">
              {[
                "Web Development",
                "Mobile Development",
                "Cloud Solutions",
                "ICT Consultation",
              ].map((service) => (
                <li
                  key={service}
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Contact Us
            </h3>

            <ul className="mt-5 space-y-4">
              {settings.contactEmail && (
                <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <FaEnvelope className="mt-1 shrink-0 text-blue-600" />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="break-all hover:text-blue-600"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}

              {settings.contactPhone && (
                <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <FaPhone className="mt-1 shrink-0 text-blue-600" />
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="hover:text-blue-600"
                  >
                    {settings.contactPhone}
                  </a>
                </li>
              )}

              {settings.address && (
                <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-blue-600" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col justify-between gap-5 border-t border-slate-200 pt-8 dark:border-slate-800 md:flex-row md:items-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} {settings.siteName || "BONETECH"}.
            All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to top
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
