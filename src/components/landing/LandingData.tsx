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

export const STEPS: Feature[] = [
  {
    tag: 'Connect',
    title: 'Connect Spotify',
    desc: 'Sign in securely with read-only Spotify OAuth and your credentials are never stored.',
    stat: { value: '10', unit: 'sec', label: 'Average Setup Time', accent: true },
  },
  {
    tag: 'Analyse',
    title: 'We analyse your history',
    desc: 'Soleri pulls your listening history from the Spotify API and processes it in real time.',
    stat: { value: '6', unit: 'months', label: 'Of Listening History' },
  },
  {
    tag: 'Explore',
    title: 'Explore your dashboard',
    desc: 'Browse all six insights in one personal dashboard.',
    stat: { value: 'QR', label: 'Share Your Taste Profile', accent: true },
  },
];