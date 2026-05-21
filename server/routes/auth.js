const express = require('express');
const router = express.Router();

/** Extracts the primary artist name, stripping featured artists. */
function primaryArtist(rawArtist) {
  return rawArtist
    .split(/\s+(?:featuring|feat\.?|ft\.?|&|\+|x|with)\s+/i)[0]
    .trim();
}

async function fetchHot100Artists() {
  const res = await fetch('https://www.billboard.com/charts/hot-100/', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`Billboard responded ${res.status}`);

  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('__NEXT_DATA__ not found on Billboard page');

  const { props } = JSON.parse(m[1]);
  const entries =
    props?.pageProps?.data?.chartData?.entries ??
    props?.pageProps?.chartData?.entries ??
    [];
  if (!entries.length) throw new Error('No chart entries found in __NEXT_DATA__');

  const seen = new Set();
  const names = [];
  for (const e of entries) {
    const raw =
      e?.chartItem?.artistName ??
      e?.artist ??
      e?.artists?.[0]?.name ??
      '';
    if (!raw) continue;
    const primary = primaryArtist(raw);
    const key = primary.toLowerCase();
    if (primary && !seen.has(key)) {
      seen.add(key);
      names.push(primary);
    }
  }
  return names;
}

function getToken(req) {
  return req.headers.authorization?.split(' ')[1];
}

/** Proxies a Spotify Web API GET request through to the client. */
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
        return {
          name: artist.name,
          popularity: artist.popularity ?? 0,
          followers: artist.followers?.total ?? 0,
          genres: artist.genres ?? [],
          image: artist.images?.[artist.images.length - 1]?.url ?? null,
        };
      }),
    );

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
});

module.exports = router;
