// Single source of truth for every PUBLIC route on soleri.
// Used by scripts/prerender.mjs for both the prerendered HTML and
// sitemap.xml, so the two can never drift. Gated routes (the OAuth
// dashboard) must never be listed here.

// The only place the site origin is resolved. Set VITE_SITE_URL in
// the environment (Vercel project settings / .env.production).
export function resolveSiteUrl(env = process.env) {
  const url = env.VITE_SITE_URL;
  if (!url) {
    console.warn(
      '[prerender] VITE_SITE_URL is not set; falling back to https://soleri.fyi',
    );
    return 'https://soleri.fyi';
  }
  return url.replace(/\/$/, '');
}

export const PUBLIC_ROUTES = [
  {
    path: '/',
    outFile: 'index.html',
    title: 'Soleri | Visualize your Spotify listening',
    description:
      'Soleri turns your Spotify listening history into live insights: top tracks and artists, listening patterns, discovery rate, artist obsessions and Billboard comparisons.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Soleri',
      applicationCategory: 'EntertainmentApplication',
      operatingSystem: 'Web',
      description:
        'Music analytics dashboard that visualizes your Spotify listening history in real time.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  },
  {
    path: '/terms',
    outFile: 'terms/index.html',
    title: 'Terms of Service | Soleri',
    description:
      'The terms that govern your use of Soleri, the Spotify listening analytics dashboard.',
  },
  {
    path: '/privacy',
    outFile: 'privacy/index.html',
    title: 'Privacy Policy | Soleri',
    description:
      'How Soleri handles your data: read-only Spotify access, in-browser processing and no stored listening history.',
  },
];
