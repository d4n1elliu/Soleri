import { motion, type Variants } from 'framer-motion';
import { FEATURES, STEPS } from './LandingData';
import { FeatureCard } from './LandingCards';
import { LandingNav } from './LandingNav';
import { LandingHero } from './LandingHero';
import { LandingCta } from './LandingCta';
import { ShowcaseSection } from './ShowcaseSection';
import { HeroCollage } from './HeroCollage';
import { VideoShowcase } from './VideoShowcase';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function LandingPage({ loginUrl }: { loginUrl: string }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-zinc-950 text-zinc-100 selection:bg-green-500 selection:text-black font-sans antialiased">
      <LandingNav loginUrl={loginUrl} />
      <main>
      <LandingHero loginUrl={loginUrl} />

      {/* Product Demo Video */}
      <VideoShowcase />

      {/* Interactive Feature Highlights */}
      <section id="overview" className="relative w-full px-4 sm:px-8 py-20">
        <div className="w-full">
          <ShowcaseSection />
        </div>
      </section>

      {/* Artist Catalog Showcase */}
      <section className="relative py-20 overflow-hidden border-y border-zinc-900 bg-zinc-950/50">
        <HeroCollage />
      </section>

      {/* Engineering Capabilities Grid */}
      <section id="features" className="scroll-mt-20 py-20 px-4 sm:px-8">
        <div className="w-full px-4 sm:px-8">
          <div className="mb-12 border-b border-zinc-900 pb-6 text-left">
            <h2 className="mt-2 text-4xl font-light tracking-tight text-white sm:text-6xl">
              Data pipeline and metrics.
            </h2>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} variants={itemVariants} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* System Architecture Flow */}
      <section id="architecture" className="scroll-mt-20 border-t border-zinc-900 py-20 px-4 sm:px-8">
        <div className="w-full px-4 sm:px-8">
          <div className="mb-12 border-b border-zinc-900 pb-6 text-left">
            <h2 className="mt-2 text-4xl font-light tracking-tight text-white sm:text-6xl">
              How it works.
            </h2>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <FeatureCard key={step.title} feature={step} index={index} variants={itemVariants} />
            ))}
          </motion.div>
        </div>
      </section>

      <LandingCta loginUrl={loginUrl} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))] text-xs text-zinc-500">
        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4">
          <div className="grid w-full grid-cols-2 gap-4 text-center sm:flex sm:w-auto sm:items-center sm:gap-6 sm:text-left">
            <a href="https://developer.spotify.com" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center whitespace-nowrap hover:text-zinc-300 transition-colors sm:min-h-0 sm:justify-start">Spotify API</a>
            <a href="https://github.com/d4n1elliu/Soleri" target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center whitespace-nowrap hover:text-zinc-300 transition-colors sm:min-h-0 sm:justify-start">Source Code</a>
            <a href="/terms" className="flex min-h-11 items-center justify-center whitespace-nowrap hover:text-zinc-300 transition-colors sm:min-h-0 sm:justify-start">Terms of Service</a>
            <a href="/privacy" className="flex min-h-11 items-center justify-center whitespace-nowrap hover:text-zinc-300 transition-colors sm:min-h-0 sm:justify-start">Privacy Policy</a>
          </div>
          <div className="text-center">© 2026 Soleri. All Rights Reserved. </div>
        </div>
      </footer>
    </div>
  );
}