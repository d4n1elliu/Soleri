export interface Feature {
  tag: string;
  title: string;
  desc: string;
  stat: {
    value: string;
    unit?: string;
    label: string;
    accent?: boolean;
  };
}

export interface Step {
  tag: string;
  title: string;
  desc: string;
  detail: string;
}

export const FEATURES: Feature[] = [
  {
    tag: 'Overview',
    title: 'Listening Stats',
    desc: 'Top tracks, artists and genres.',
    stat: { value: '2,847', unit: 'tracks', label: 'Analysed Past 3 Months', accent: true },
  },
  {
    tag: 'Patterns',
    title: 'Listening Clock',
    desc: 'Your listening habits by hour.',
    stat: { value: '11 PM', label: 'Peak Listening Hour' },
  },
  {
    tag: 'Discovery',
    title: 'Discovery Rate',
    desc: 'New music versus replayed favourites.',
    stat: { value: '27%', label: 'New Artists This Month', accent: true },
  },
  {
    tag: 'Sessions',
    title: 'Listening Marathons',
    desc: 'Your longest uninterrupted listening sessions.',
    stat: { value: '5.8', unit: 'hrs', label: 'Longest Session' },
  },
  {
    tag: 'Phases',
    title: 'Artist Obsessions',
    desc: 'When one artist took over.',
    stat: { value: '19', unit: 'days', label: 'Longest Obsession', accent: true },
  },
  {
    tag: 'Charts',
    title: 'Billboard Comparison',
    desc: 'Your taste versus the charts.',
    stat: { value: '31%', label: 'Mainstream Overlap' },
  },
];

export const STEPS: Step[] = [
  {
    tag: 'Connect',
    title: 'Connect your Spotify account',
    desc: 'Sign in securely via Spotify OAuth. Soleri only requests read-only access and never stores your credentials or modifies your personal library.',
    detail: 'Takes under 10 seconds. No credit card required.',
  },
  {
    tag: 'Analyse',
    title: 'We analyse your listening history',
    desc: 'Soleri pulls your top tracks, artists, genres and recent play history directly from the Spotify API and processes it in real time.',
    detail: 'Your last 6 months of data turned into six distinct insights instantly.',
  },
  {
    tag: 'Explore',
    title: 'Explore your personal dashboard',
    desc: 'Browse your Listening Stats, Clock, Discovery Rate, Marathons, Artist Obsessions and Billboard Comparison all in one place.',
    detail: 'Share your taste profile with friends via your personal QR code.',
  },
];