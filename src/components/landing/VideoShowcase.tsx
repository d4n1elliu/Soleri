import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VIDEO_WEBM = '/demo/soleri-demo.webm';
const VIDEO_MP4 = '/demo/soleri-demo.mp4';
const VIDEO_POSTER = '/demo/soleri-demo-poster.jpg';

export function VideoShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.94, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <section ref={sectionRef} className="relative px-4 pb-20 sm:px-8">
      <motion.div
        style={{ scale }}
        onViewportEnter={() => videoRef.current?.play().catch(() => {})}
        onViewportLeave={() => videoRef.current?.pause()}
        className="relative mx-auto max-w-6xl"
      >
        <motion.div
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute -inset-x-16 -top-16 h-64 rounded-full bg-emerald-500/10 blur-3xl"
        />

        {/* Browser frame */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/30 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 border-b border-zinc-800/60 px-6 py-4">
            <div className="flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            </div>
            <span className="rounded-full bg-zinc-950/60 px-4 py-1 font-mono text-[11px] tracking-widest text-zinc-500">
              Live Dashboard Preview
            </span>
          </div>

          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={VIDEO_POSTER}
            className="aspect-video w-full bg-zinc-950 object-cover"
          >
            <source src={VIDEO_WEBM} type="video/webm" />
            <source src={VIDEO_MP4} type="video/mp4" />
          </video>
        </div>
      </motion.div>
    </section>
  );
}
