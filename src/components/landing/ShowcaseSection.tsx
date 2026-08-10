import { motion } from 'framer-motion';

export function ShowcaseSection() {
  return (
    <div className="w-full px-4 sm:px-8">
      {/* Header - Minimal & Editorial */}
      <div className="mb-12 border-b border-zinc-900 pb-6 text-left">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Interactive Showcase
        </span>
        <h2 className="mt-2 text-4xl font-light tracking-tight text-white sm:text-6xl">
          Explore your music universe.
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        
        {/* Card 1: Main Feature (Spans 2 columns) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-8 backdrop-blur-xl md:col-span-2"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">01 / Overview</span>
            <h3 className="mt-4 text-2xl font-normal text-white sm:text-3xl">Personalized Stats</h3>
            <p className="mt-2 max-w-sm text-xs text-zinc-400 leading-relaxed">
              Instant view of your streaming habits, listening timeframes, and top genres calculated live.
            </p>
          </div>

          {/* Metric Footer (Cleaned Up) */}
          <div className="mt-12 border-t border-zinc-800/60 pt-6">
            <p className="text-4xl font-light text-emerald-400 sm:text-5xl">Top 0.5%</p>
            <p className="mt-1 text-[11px] font-medium tracking-wide uppercase text-zinc-500">Global Music Enthusiast</p>
          </div>
        </motion.div>

        {/* Card 2: Square Tile */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-8 backdrop-blur-xl"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">02 / Patterns</span>
            <h3 className="mt-4 text-xl font-normal text-white">Listening Clock</h3>
            <p className="mt-2 text-xs text-zinc-400">Peak listening hours & daily audio heatmaps.</p>
          </div>

          <div className="mt-8 border-t border-zinc-800/60 pt-6">
            <p className="text-3xl font-light text-white">142 <span className="text-sm font-normal text-zinc-400">hrs</span></p>
            <p className="mt-1 text-[11px] font-medium tracking-wide uppercase text-zinc-500">Streamed This Month</p>
          </div>
        </motion.div>

        {/* Card 3: Square Tile */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="flex flex-col justify-between rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-8 backdrop-blur-xl"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">03 / Discovery</span>
            <h3 className="mt-4 text-xl font-normal text-white">Obscurity Score</h3>
            <p className="mt-2 text-xs text-zinc-400">Niche vs mainstream music distribution.</p>
          </div>

          <div className="mt-8 border-t border-zinc-800/60 pt-6">
            <p className="text-3xl font-light text-emerald-400">68%</p>
            <p className="mt-1 text-[11px] font-medium tracking-wide uppercase text-zinc-500">Underground Taste</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}