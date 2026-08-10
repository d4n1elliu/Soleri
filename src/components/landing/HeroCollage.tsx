import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Replace these image paths with your actual asset locations
const ARTISTS = [
  {
    name: 'Justin Bieber',
    image: '/artists/justin_bieber.jpg', // Update path
    direction: { x: '-140%', y: '-40%', rotate: -8 },
    hoverRotate: -12,
  },
  {
    name: 'The Weeknd',
    image: '/artists/the_weeknd.jpg', // Update path
    direction: { x: '-60%', y: '40%', rotate: -3 },
    hoverRotate: -6,
  },
  {
    name: 'Rosé',
    image: '/artists/rose.jpg', // Update path
    direction: { x: '60%', y: '-50%', rotate: 6 },
    hoverRotate: 10,
  },
  {
    name: 'Sabrina Carpenter',
    image: '/artists/sabrina_carpenter.jpg', // Update path
    direction: { x: '120%', y: '30%', rotate: 12 },
    hoverRotate: 15,
  },
];

export function HeroCollage() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Triggers the explosion as soon as the user scrolls into view
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={containerRef} 
      className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden py-24"
    >
      {/* Ambient Radial Backdrop Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      {/* Central Container holding the 4-way split */}
      <div className="relative flex h-80 w-80 items-center justify-center">
        {ARTISTS.map((artist, index) => (
          <motion.div
            key={artist.name}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
            animate={
              isInView 
                ? { 
                    x: artist.direction.x, 
                    y: artist.direction.y, 
                    opacity: 1, 
                    scale: 1, 
                    rotate: artist.direction.rotate 
                  }
                : {}
            }
            transition={{
              duration: 0.9,
              delay: index * 0.1, // Staggered explosion effect
              ease: [0.16, 1, 0.3, 1], // Smooth custom cubic-bezier
            }}
            whileHover={{ 
              scale: 1.08, 
              rotate: artist.hoverRotate,
              zIndex: 30,
              transition: { duration: 0.25 }
            }}
            className="absolute h-64 w-48 cursor-pointer overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 shadow-2xl backdrop-blur-md transition-shadow hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
          >
            <img 
              src={artist.image} 
              alt={artist.name} 
              className="h-full w-full object-cover" 
            />
            
            {/* Subtle Gradient Overlay & Label on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100">
              <span className="absolute bottom-3 left-3 text-xs font-medium uppercase tracking-wider text-white">
                {artist.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}