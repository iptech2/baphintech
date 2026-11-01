import { motion } from "framer-motion";

function WorkingBanner() {
  const message =
    "⚡ Baphin Tech — Available 24/7 | ICT Support • Web Development • Software Solutions • Cloud Services • ICT Consultation";

  return (
    <div className="sticky top-0 z-40 w-full overflow-hidden border-b border-amber-500 bg-amber-400">
      <motion.div
        className="flex min-w-max whitespace-nowrap py-2 text-sm font-bold text-slate-900"
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span className="mx-10">{message}</span>
        <span className="mx-10">{message}</span>
        <span className="mx-10">{message}</span>
      </motion.div>
    </div>
  );
}

export default WorkingBanner;