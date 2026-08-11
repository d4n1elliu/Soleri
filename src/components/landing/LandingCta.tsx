import { motion } from 'framer-motion';

export function LandingCta({ loginUrl }: { loginUrl: string }) {
  return (
    <section className="relative overflow-hidden border-t border-zinc-900 px-4 py-32 sm:px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Live Demo</span>
        <h2 className="mt-4 text-4xl font-light tracking-tight text-white sm:text-6xl">
          See your music, live.
        </h2>

        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={loginUrl}
          className="mt-10 rounded-full bg-green-500 px-10 py-4 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-green-400"
        >
          Connect Spotify
        </motion.a>
      </motion.div>
    </section>
  );
}
