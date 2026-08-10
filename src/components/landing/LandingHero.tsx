import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function LandingHero({ loginUrl }: { loginUrl: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center"
    >
      {/* Radial Glow */}
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[140px]"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl"
      >
        {/* Main Headline Only */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl font-light tracking-tight text-white sm:text-8xl lg:text-9xl leading-[1.05]"
        >
          Listen. <br />
          <span className="font-normal text-zinc-400 italic">
            Visualize. Decoded.
          </span>
        </motion.h1>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={loginUrl}
            className="rounded-full bg-green-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-green-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]"
          >
            Launch Live App
          </motion.a>
          <a
            href="https://github.com/d4n1elliu/Spoti-list"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-800 bg-zinc-900/50 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
          >
            View Source
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
