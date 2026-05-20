const FEATURES = [
  {
    icon: '🎧',
    title: 'Listening Stats',
    desc: 'Your top tracks, artists and genres at a glance.',
  },
  {
    icon: '🕒',
    title: 'Listening Clock',
    desc: 'A heatmap of when you listen across hours and days.',
  },
  {
    icon: '📈',
    title: 'Discovery Rate',
    desc: 'See how often you explore new music versus replaying favourites.',
  },
  {
    icon: '🔥',
    title: 'Listening Marathons',
    desc: 'Your longest uninterrupted listening sessions, ranked.',
  },
  {
    icon: '💫',
    title: 'Artist Obsessions',
    desc: 'Phases where one artist took over — then faded out.',
  },
  {
    icon: '🏆',
    title: 'Billboard Comparison',
    desc: 'Measure your taste against the Billboard chart artists.',
  },
];

const STEPS = [
  {
    title: 'Connect your Spotify',
    desc: 'Securely sign in with Spotify. We only request read access to your listening data.',
  },
  {
    title: 'We analyse your history',
    desc: 'Spoti-List crunches your top tracks, artists and recent plays into clear insights.',
  },
  {
    title: 'Explore your dashboard',
    desc: 'Dive into heatmaps, marathons, discovery trends and your Billboard score.',
  },
];

export function LandingPage({ loginUrl }: { loginUrl: string }) {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Navigation bar */}
      <nav className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎵</span>
            <span className="text-lg font-bold tracking-tight">Spoti-List</span>
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
          </div>
        </div>
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
              Spoti-List turns your Spotify listening history into a personal
              dashboard — discover your patterns, obsessions and how your taste
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

          {/* Right column — overlapping card collage */}
          <div className="relative hidden h-[460px] lg:block">
            <div className="absolute left-[26%] top-[8%] z-20 flex h-56 w-44 rotate-3 flex-col justify-between rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 p-4 shadow-2xl ring-1 ring-white/10">
              <span className="text-4xl">🎧</span>
              <span className="text-sm font-semibold text-white">
                Listening Stats
              </span>
            </div>
            <div className="absolute right-0 top-0 z-10 flex h-40 w-32 -rotate-6 flex-col justify-between rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 p-4 shadow-2xl ring-1 ring-white/10">
              <span className="text-4xl">🕒</span>
              <span className="text-sm font-semibold text-white">
                Listening Clock
              </span>
            </div>
            <div className="absolute left-0 top-[30%] z-10 flex h-36 w-28 -rotate-3 flex-col justify-between rounded-2xl bg-gradient-to-br from-violet-400 to-purple-700 p-4 shadow-2xl ring-1 ring-white/10">
              <span className="text-3xl">📈</span>
              <span className="text-xs font-semibold text-white">
                Discovery Rate
              </span>
            </div>
            <div className="absolute bottom-0 left-[18%] z-10 flex h-44 w-32 rotate-6 flex-col justify-between rounded-2xl bg-gradient-to-br from-amber-300 to-orange-600 p-4 shadow-2xl ring-1 ring-white/10">
              <span className="text-4xl">🔥</span>
              <span className="text-sm font-semibold text-white">
                Marathons
              </span>
            </div>
            <div className="absolute bottom-[6%] right-[8%] z-30 flex h-40 w-32 rotate-3 flex-col justify-between rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 p-4 shadow-2xl ring-1 ring-white/10">
              <span className="text-4xl">🏆</span>
              <span className="text-sm font-semibold text-white">
                Billboard
              </span>
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
            Six ways Spoti-List turns raw listening data into something you can
            actually read.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-zinc-800 transition-colors hover:ring-zinc-700"
              >
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="mt-3 text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{feature.desc}</p>
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
            From connecting your account to exploring your dashboard in three
            simple steps.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl bg-zinc-800/60 p-6 ring-1 ring-zinc-800"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-black">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{step.desc}</p>
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
      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-600">
        Spoti-List · Built with the Spotify Web API
      </footer>
    </div>
  );
}
