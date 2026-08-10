import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ParallaxShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth scroll scale and translations
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.88, 1]);
  const yShift = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="relative my-16 px-6 py-20">
      <motion.div
        style={{ scale }}
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-800/80 to-zinc-900/90 p-8 shadow-2xl backdrop-blur sm:p-12"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <motion.div style={{ y: textY }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-green-400">
              Interactive Preview
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Take your music analytics to new depths
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Soleri builds an evolving visual canvas of your listening habits. As you scroll through your monthly insights, watch your trends, obsessions, and top genres frame your unique profile.
            </p>
          </motion.div>

          {/* Floating Insight Card Frame */}
          <motion.div style={{ y: yShift }} className="relative rounded-2xl border border-zinc-700/60 bg-zinc-950/80 p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs font-medium text-zinc-400">Top Artist Obsession</span>
              <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400">
                #1 Spotify
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-zinc-800" />
              <div>
                <p className="text-sm font-bold text-white">96 hours streamed</p>
                <p className="text-xs text-zinc-400">Top 0.1% listener worldwide</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}