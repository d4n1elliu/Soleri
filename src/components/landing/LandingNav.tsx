import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LandingNav({ loginUrl }: { loginUrl: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
      {/* Set w-full, px-4 (or px-2 / px-0) so items sit right at the edges */}
      <div className="flex w-full items-center justify-between px-4 py-5">
        
        {/* Far Left: Logo */}
        <div className="flex items-center gap-3">
          <img src="/Soleri.svg" alt="Soleri logo" className="h-7 w-7 rounded-md" />
          <span className="text-sm font-semibold tracking-wide uppercase text-white">Soleri</span>
        </div>

        {/* Far Right: Links + Demo Button */}
        <div className="flex items-center gap-8">
          <div className="hidden gap-8 text-xs font-medium uppercase tracking-widest text-zinc-400 md:flex">
            <a href="#overview" className="transition-colors hover:text-white">Explore</a>
            <a href="#features" className="transition-colors hover:text-white">Insights</a>
            <a href="#architecture" className="transition-colors hover:text-white">How It Works</a>
          </div>

          <motion.a 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            href={loginUrl} 
            className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-zinc-200"
          >
            Live Demo
          </motion.a>

          <button 
            onClick={() => setMenuOpen((o) => !o)} 
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden" 
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-5 bg-zinc-300 transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-5 bg-zinc-300 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-5 bg-zinc-300 transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="overflow-hidden border-t border-zinc-900 bg-zinc-950 px-4 py-4 md:hidden"
          >
            <a href="#overview" onClick={() => setMenuOpen(false)} className="block py-2 text-xs font-medium uppercase tracking-wider text-zinc-400 hover:text-white">Explore</a>
            <a href="#features" onClick={() => setMenuOpen(false)} className="block py-2 text-xs font-medium uppercase tracking-wider text-zinc-400 hover:text-white">Insights</a>
            <a href="#architecture" onClick={() => setMenuOpen(false)} className="block py-2 text-xs font-medium uppercase tracking-wider text-zinc-400 hover:text-white">How It Works</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 