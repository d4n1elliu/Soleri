import { useState } from 'react';
import justinBieber from '../../assets/JustinBieberCoachella2026.png';
import rose from '../../assets/rose.jpg';
import sabrinaCarpenter from '../../assets/sabrina_carpenter.jpg';
import theWeeknd from '../../assets/the_weekend.jpg';

const FEATURES = [
  {
    title: 'Listening Stats',
    desc: 'Your top tracks, artists and genres at a glance.',
    detail: 'Check out your all time and recent favourites ranked by play count, broken down by track, artist and genre.',
  },
  {
    title: 'Listening Clock',
    desc: 'A heatmap of when you listen across hours and days.',
    detail: 'Discover whether you are a night listener, a morning commuter or a weekend binge listener.',
  },
  {
    title: 'Discovery Rate',
    desc: 'See how often you explore new music versus replaying favourites.',
    detail: 'Track how adventurous your taste is over time and watch your discovery score shift as you branch out or settle in.',
  },
  {
    title: 'Listening Marathons',
    desc: 'Your longest uninterrupted listening sessions, ranked.',
    detail: 'Relive your longest music runs! Every marathon session captured, dated and ranked so you can see when music truly took over.',
  },
  {
    title: 'Artist Obsessions',
    desc: 'Phases where one artist took over your life',
    detail: 'Map the arc of every artist obsession: when it started, how intense it peaked, and when you finally moved on.',
  },
  {
    title: 'Billboard Comparison',
    desc: 'Measure your taste against the Billboard chart artists.',
    detail: 'Find out where your listening overlaps with the mainstream.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Connect your Spotify account',
    desc: 'Sign in securely via Spotify OAuth. Soleri only requests read-only access and never stores your credentials or modifies your library.',
    detail: 'Takes under 10 seconds. No credit card required.',
  },
  {
    step: '02',
    title: 'We analyse your listening history',
    desc: 'Soleri pulls your top tracks, artists, genres and recent play history directly from the Spotify API and processes it in real time.',
    detail: 'Your last 6 months of data turned into six distinct insights instantly.',
  },
  {
    step: '03',
    title: 'Explore your personal dashboard',
    desc: 'Browse your Listening Stats, Clock, Discovery Rate, Marathons, Artist Obsessions and Billboard Comparison all in one place.',
    detail: 'Share your taste profile with friends via your personal QR code.',
  },
];

export function LandingPage({ loginUrl }: { loginUrl: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/Soleri.svg" alt="Soleri logo" className="h-8 w-8 rounded-md" />
            <span className="text-lg font-bold tracking-tight">Soleri</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#features"
              className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
            >
              How it works
            </a>
            <a
              href={loginUrl}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Log in
            </a>
            <a
              href={loginUrl}
              className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-green-400"
            >
              Get started
            </a>
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden"
              aria-label="Toggle menu"
            >
              <span className={`h-0.5 w-5 bg-zinc-300 transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 w-5 bg-zinc-300 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 bg-zinc-300 transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-zinc-800 bg-zinc-900 px-6 py-3 sm:hidden">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              How it works
            </a>
          </div>
        )}
      </nav>

      {/* Hero — text left, collage right */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          {/* Left column */}
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full border border-zinc-700 px-4 py-1 text-xs uppercase tracking-widest text-zinc-400">
              Your Personal Spotify Analytics
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Understand your music taste like never before
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base text-zinc-400 lg:mx-0">
              Soleri turns your Spotify listening history into a personal
              dashboard discover your patterns, obsessions and how your taste
              stacks up against the charts.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <a
                href={loginUrl}
                className="rounded-full bg-green-500 px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400"
              >
                Connect with Spotify
              </a>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Free · No data stored · Read-only access
            </p>
          </div>

          {/* Right column — overlapping photo collage */}
          <div className="relative hidden h-[460px] lg:block">
            <div className="absolute left-[22%] top-[4%] z-20 h-64 w-48 rotate-3 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/20">
              <img
                src={justinBieber}
                alt="Justin Bieber at Coachella"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute right-0 top-0 z-10 h-44 w-36 -rotate-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <img
                src={rose}
                alt="Rosé"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-[8%] z-10 h-52 w-40 rotate-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <img
                src={theWeeknd}
                alt="The Weeknd performing"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-[8%] right-[4%] z-30 h-48 w-40 rotate-3 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <img
                src={sabrinaCarpenter}
                alt="Sabrina Carpenter"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature band */}
      <section id="features" className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your music says about you
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-400">
            Six ways to show your recent listening data. 
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col rounded-2xl bg-zinc-900 p-8 ring-1 ring-zinc-800 transition-colors hover:ring-zinc-700"
              >
                <div className="mb-5 h-px w-10 bg-green-500" />
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-zinc-300">{feature.desc}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-400">
            From connecting your Spotify account to a fully personalised dashboard in three steps.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="relative flex flex-col rounded-2xl bg-zinc-900 p-8 ring-1 ring-zinc-800 transition-colors hover:ring-zinc-700"
              >
                <span className="text-5xl font-black text-zinc-800 leading-none select-none">
                  {step.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.desc}</p>
                <p className="mt-4 text-xs font-medium text-green-500">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-3xl bg-gradient-to-br from-green-500/15 to-zinc-800 px-6 py-14 text-center ring-1 ring-white/5">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to see your sound?
          </h2>
          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Connect your account and your personalised dashboard will be ready
            in seconds.
          </p>
          <a
            href={loginUrl}
            className="mt-6 rounded-full bg-green-500 px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400"
          >
            Connect with Spotify
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <a
              href="https://developer.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              Spotify Web API
            </a>
            <span className="text-zinc-700">|</span>
            <a
              href="https://github.com/d4n1elliu/Spoti-list"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              GitHub
            </a>
            <span className="text-zinc-700">|</span>
            <span>© 2025-2026 Soleri. All rights reserved.</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Back to top <span className="text-[10px]">▲</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
