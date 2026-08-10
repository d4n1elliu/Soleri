export interface Feature {
  title: string;
  desc: string;
  detail: string;
}

export interface Step {
  step: string;
  title: string;
  desc: string;
  detail: string;
}

export const FEATURES: Feature[] = [
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
    desc: 'Your longest uninterrupted listening sessions.',
    detail: 'Relive your longest music runs! Every marathon session captured, dated and ranked so you can see when music truly took over.',
  },
  {
    title: 'Artist Obsessions',
    desc: 'Phases where one artist took over your life',
    detail: 'Map the arc of every artist obsession: when it started, how intense it peaked and when you finally moved on.',
  },
  {
    title: 'Billboard Comparison',
    desc: 'Measure your taste against the Billboard chart artists.',
    detail: 'Find out where your listening overlaps with the mainstream.',
  },
];

export const STEPS: Step[] = [
  {
    step: '01',
    title: 'Connect your Spotify account',
    desc: 'Sign in securely via Spotify OAuth. Soleri only requests read-only access and never stores your credentials or modifies your personal library.',
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