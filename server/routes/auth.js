const express = require('express');
const router = express.Router();

// Extracting the primary artist name and removing featured artists in song title
// e.g. Justin Bieber feat Skrillex to just "Justin Bieber"

function primaryArtist(rawArtist) {
  return rawArtist
    .split(/\s+(?:featuring|feat\.?|ft\.?|&|\+|x|with)\s+/i)[0]
    .trim();
}

// Converts HTML entities like &amp; back to normal characters
function htmlDecode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

// Scrapes the Billboard Hot 100 page and returns a list of artist names.
// Billboard has no public API so we parse the raw HTML instead.
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

    // Each chart entry is separated by this class name in the HTML
    const rows = html.split('o-chart-results-list-row-container');
    const seen = new Set();
    const names = [];

    for (const row of rows) {
      const m = row.match(/<span[^>]*c-label[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
      if (!m) continue;
      const raw = htmlDecode(m[1].trim());
      const primary = primaryArtist(raw);
      const key = primary.toLowerCase();
      // Remove duplicated artist so only one artist can appear on the chart at once
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

// Pulls the Bearer token out of the Authorization header
function getToken(req) {
  return req.headers.authorization?.split(' ')[1];
}

// Forwards a request to the Spotify API and sends the response back to the client
async function proxySpotify(req, res, url, label) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(`${label} error:`, err.message);
    res.status(500).json({ error: `Failed to fetch ${label}` });
  }
}

// Swaps the OAuth code Spotify sends back for an access token
router.get('/authenticate', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing code parameter' });

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error('Token exchange error:', err.message);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

// These three routes just proxy straight through to Spotify
router.get('/top-songs', (req, res) =>
  proxySpotify(req, res, 'https://api.spotify.com/v1/me/top/tracks?limit=50', 'top tracks'),
);

router.get('/top-artists', (req, res) =>
  proxySpotify(req, res, 'https://api.spotify.com/v1/me/top/artists?limit=50', 'top artists'),
);

router.get('/recently_played_song', (req, res) =>
  proxySpotify(
    req,
    res,
    'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    'recently played songs',
  ),
);

// Gets the Billboard chart, then finds each artist's popularity and image on Spotify.
// Runs on the server because it makes a lot of Spotify lookups.
router.get('/billboard', async (req, res) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    const artistNames = await fetchHot100Artists();

    const resolved = await Promise.all(
      artistNames.map(async (name) => {
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
        // No image found then skip it
        if (!artist.images?.length) return null;

        return {
          name: artist.name,
          popularity: artist.popularity ?? 0,
          followers: artist.followers?.total ?? 0,
          genres: artist.genres ?? [],
          image: artist.images[artist.images.length - 1].url,
          url: artist.external_urls?.spotify ?? `https://open.spotify.com/artist/${artist.id}`,
        };
      }),
    );

    // Remove nulls and deduplicate by name
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

    // Tally genres across all artists and return the top 12
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
});

module.exports = router;
