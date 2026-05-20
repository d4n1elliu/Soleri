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
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 rounded-full border border-zinc-700 px-4 py-1 text-xs uppercase tracking-widest text-zinc-400">
          Your Personal Spotify Analytics
        </span>
        <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Understand your music taste like never before
        </h2>
        <p className="mt-4 max-w-xl text-base text-zinc-400">
          Spoti-List turns your Spotify listening history into a personal
          dashboard — discover your patterns, obsessions and how your taste
          stacks up against the charts.
        </p>
        <a
          href={loginUrl}
          className="mt-8 rounded-full bg-green-500 px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400"
        >
          Connect with Spotify
        </a>
        <p className="mt-3 text-xs text-zinc-500">
          Free · No data stored · Read-only access
        </p>
      </section>

      {/* Feature overview */}
      <section className="mt-20">
        <h3 className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-zinc-400">
          What you'll discover
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-zinc-800 p-5 transition-colors hover:bg-zinc-700/70"
            >
              <span className="text-2xl">{feature.icon}</span>
              <h4 className="mt-3 text-base font-semibold text-white">
                {feature.title}
              </h4>
              <p className="mt-1 text-sm text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Onboarding steps */}
      <section className="mt-20">
        <h3 className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-zinc-400">
          How it works
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-xl bg-zinc-800 p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-black">
                {index + 1}
              </span>
              <h4 className="mt-4 text-base font-semibold text-white">
                {step.title}
              </h4>
              <p className="mt-1 text-sm text-zinc-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mt-20 flex flex-col items-center rounded-2xl bg-zinc-800 px-6 py-12 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Ready to see your sound?
        </h3>
        <p className="mt-2 max-w-md text-sm text-zinc-400">
          Connect your account and your personalised dashboard will be ready in
          seconds.
        </p>
        <a
          href={loginUrl}
          className="mt-6 rounded-full bg-green-500 px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400"
        >
          Connect with Spotify
        </a>
      </section>
    </div>
  );
}
