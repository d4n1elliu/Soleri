import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import { useMediaQuery } from '../../hooks';

const ARTISTS = [
  {
    name: 'Justin Bieber',
    image: '/artists/justin_bieber.jpg',
    rest: { x: '-20px', y: '-10px', rotate: -8 },
    expanded: { x: '-110%', y: '0%', rotate: -14 },
    expandedCompact: { x: '-18vw', y: '0vw', rotate: -10 },
    hoverRotate: -18,
    zIndex: 10,
  },
  {
    name: 'The Weeknd',
    image: '/artists/the_weeknd.jpg',
    rest: { x: '-10px', y: '5px', rotate: -3 },
    expanded: { x: '-45%', y: '20%', rotate: -6 },
    expandedCompact: { x: '-6vw', y: '2vw', rotate: -4 },
    hoverRotate: -10,
    zIndex: 20,
  },
  {
    name: 'Rosé',
    image: '/artists/rose.jpg',
    rest: { x: '10px', y: '-15px', rotate: 6 },
    expanded: { x: '45%', y: '-10%', rotate: 12 },
    expandedCompact: { x: '6vw', y: '-2vw', rotate: 6 },
    hoverRotate: 16,
    zIndex: 15,
  },
  {
    name: 'Sabrina Carpenter',
    image: '/artists/sabrina_carpenter.jpg',
    rest: { x: '15px', y: '15px', rotate: 8 },
    expanded: { x: '25%', y: '30%', rotate: 10 },
    expandedCompact: { x: '18vw', y: '3vw', rotate: 10 },
    hoverRotate: 14,
    zIndex: 30,
  },
];

interface CardCustom {
  artist: (typeof ARTISTS)[number];
  compact: boolean;
}

const cardVariants: Variants = {
  rest: ({ artist }: CardCustom) => ({
    x: artist.rest.x,
    y: artist.rest.y,
    rotate: artist.rest.rotate,
    scale: 0.95,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  expanded: ({ artist, compact }: CardCustom) => {
    const target = compact ? artist.expandedCompact : artist.expanded;
    return {
      x: target.x,
      y: target.y,
      rotate: target.rotate,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    };
  },
};

export function HeroCollage() {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const compact = useMediaQuery('(max-width: 639px)');
  const isExpanded = canHover ? isHovered : isTapped;

  function toggleTap() {
    if (!canHover) setIsTapped((open) => !open);
  }

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">

      {/* Background Particle/Noise Accents */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-12 opacity-30 select-none">
        <div className="h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-600/20 via-zinc-900/10 to-transparent blur-2xl" />
        <div className="h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-600/20 via-zinc-900/10 to-transparent blur-2xl" />
      </div>

      {/* Center Interactive Collage */}
      <div
        onMouseEnter={() => canHover && setIsHovered(true)}
        onMouseLeave={() => canHover && setIsHovered(false)}
        onClick={toggleTap}
        className="relative flex h-[min(64vw,280px)] w-full max-w-2xl cursor-pointer items-center justify-center z-10 sm:h-[300px]"
      >
        <div className="relative flex h-[min(56vw,240px)] w-[min(42vw,180px)] items-center justify-center sm:h-72 sm:w-72">
          {ARTISTS.map((artist) => (
            <motion.div
              key={artist.name}
              custom={{ artist, compact }}
              variants={cardVariants}
              initial="rest"
              animate={isExpanded ? 'expanded' : 'rest'}
              whileHover={
                canHover
                  ? {
                      scale: 1.08,
                      rotate: artist.hoverRotate,
                      zIndex: 50,
                      transition: { duration: 0.2 },
                    }
                  : undefined
              }
              style={{ zIndex: artist.zIndex }}
              className="absolute h-[min(56vw,240px)] w-[min(42vw,180px)] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl transition-shadow duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.9)] sm:h-64 sm:w-48"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="h-full w-full object-cover pointer-events-none"
              />

              {/* Minimal Text Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 flex items-end p-4">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  {artist.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Safe Dedicated Container for Action Text */}
      <div className="relative z-10 mt-8 flex min-h-11 items-center justify-center sm:mt-12 sm:min-h-8">
        <motion.div
          onClick={toggleTap}
          animate={{
            y: isExpanded ? (compact ? 8 : 24) : 0, // Clears the lower boundaries of expanded cards safely
            opacity: compact ? 1 : isExpanded ? 0.9 : 0.5,
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex min-h-11 items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-200 hover:text-zinc-100 transition-colors cursor-pointer sm:min-h-0 sm:text-zinc-400"
        >
          <span>Explore Roster</span>
          <span>&rarr;</span>
        </motion.div>
      </div>

    </section>
  );
}
