import { motion } from 'framer-motion';

export function LandingCta({ loginUrl }: { loginUrl: string }) {
  return (
    <section className="px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.5 }} 
        className="mx-auto flex max-w-4xl flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/30 px-8 py-16 text-center shadow-xl backdrop-blur-md"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Live Demonstration</span>
        <h2 className="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl">Explore your personal audio metrics</h2>
        <p className="mt-3 max-w-md text-xs leading-relaxed text-zinc-400">Authenticate securely via Spotify OAuth to view real-time calculations based on your account history.</p>
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <motion.a 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            href={loginUrl} 
            className="rounded-full bg-green-500 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-green-400"
          >
            Authenticate with Spotify
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}