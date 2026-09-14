// Public routes only. Drives both the prerendered HTML and sitemap.xml.

// Site origin comes from VITE_SITE_URL.
export function resolveSiteUrl(env = process.env) {
  const url = env.VITE_SITE_URL;
  if (!url) {
    console.warn(
      '[prerender] VITE_SITE_URL is not set; falling back to https://www.soleri.fyi',
    );
    return 'https://www.soleri.fyi';
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
    // Structured data for the landing page; needs the site origin for absolute @id URLs.
    jsonLd: (siteUrl) => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          name: 'Soleri',
          url: `${siteUrl}/`,
          description:
            'Soleri turns your Spotify listening history into live insights: top tracks and artists, listening patterns, discovery rate, artist obsessions and Billboard comparisons.',
          inLanguage: 'en',
          publisher: { '@id': `${siteUrl}/#org` },
        },
        {
          '@type': 'Organization',
          '@id': `${siteUrl}/#org`,
          name: 'Soleri',
          url: `${siteUrl}/`,
          logo: `${siteUrl}/Soleri.svg`,
          sameAs: ['https://github.com/d4n1elliu/Soleri'],
        },
        {
          '@type': 'WebApplication',
          '@id': `${siteUrl}/#app`,
          name: 'Soleri',
          url: `${siteUrl}/`,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Any (web browser)',
          browserRequirements: 'Requires JavaScript and a Spotify account',
          description:
            'Music analytics dashboard that visualizes your Spotify listening history in real time.',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@id': `${siteUrl}/#org` },
        },
      ],
    }),
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
