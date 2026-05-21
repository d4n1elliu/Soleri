/** Extracts the primary artist name, stripping featured artists. */
function primaryArtist(rawArtist) {
  return rawArtist
    .split(/\s+(?:featuring|feat\.?|ft\.?|&|\+|x|with)\s+/i)[0]
    .trim();
}

function htmlDecode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

async function fetchHot100Artists() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch('https://www.billboard.com/charts/hot-100/', {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html',
      },
    });
    if (!res.ok) throw new Error(`Billboard responded ${res.status}`);

    const html = await res.text();

    // Split page into per-row blocks then extract the artist link from each
    const rows = html.split('o-chart-results-list-row-container');
    const seen = new Set();
    const names = [];

    for (const row of rows) {
      const m = row.match(/<span[^>]*c-label[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
      if (!m) continue;
      const raw = htmlDecode(m[1].trim());
      const primary = primaryArtist(raw);
      const key = primary.toLowerCase();
      if (primary && !seen.has(key)) {
        seen.add(key);
        names.push(primary);
      }
    }

    if (!names.length) throw new Error('No artists parsed from Billboard page');
    return names;
  } finally {
    clearTimeout(timeout);
  }
}

async function lookupArtist(name, token) {
  const url =
    'https://api.spotify.com/v1/search?' +
    new URLSearchParams({ q: name, type: 'artist', limit: '1' });

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;

  const data = await response.json();
  const artist = data.artists?.items?.[0];
  if (!artist) return null;

  // Discard results with no image — they're almost always wrong Spotify matches
  if (!artist.images?.length) return null;

  return {
    name: artist.name,
    popularity: artist.popularity ?? 0,
    followers: artist.followers?.total ?? 0,
    genres: artist.genres ?? [],
    image: artist.images[artist.images.length - 1].url,
    url: artist.external_urls?.spotify ?? `https://open.spotify.com/artist/${artist.id}`,
  };
}

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    const artistNames = await fetchHot100Artists();

    const resolved = await Promise.all(
      artistNames.map((name) => lookupArtist(name, token)),
    );

    // Deduplicate by resolved Spotify name
    const resolvedSeen = new Set();
    const artists = resolved.filter((a) => {
      if (!a) return false;
      const key = a.name.toLowerCase();
      if (resolvedSeen.has(key)) return false;
      resolvedSeen.add(key);
      return true;
    });

    if (artists.length === 0) {
      return res.status(502).json({ error: 'Could not resolve Billboard data' });
    }

    const averagePopularity = Math.round(
      artists.reduce((sum, a) => sum + a.popularity, 0) / artists.length,
    );
    const averageFollowers = Math.round(
      artists.reduce((sum, a) => sum + a.followers, 0) / artists.length,
    );

    const genreCounts = {};
    for (const artist of artists) {
      for (const genre of artist.genres) {
        genreCounts[genre] = (genreCounts[genre] ?? 0) + 1;
      }
    }
    const genres = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    res.json({ artists, averagePopularity, averageFollowers, genres });
  } catch (err) {
    console.error('Billboard comparison error:', err.message);
    res.status(500).json({ error: 'Failed to build Billboard comparison' });
  }
}
