import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { getChart } = require('billboard-top-100');

/** Promisified wrapper around billboard-top-100's callback API. */
function fetchHot100() {
  return new Promise((resolve, reject) => {
    getChart('hot-100', (err, chart) => {
      if (err) reject(err);
      else resolve(chart);
    });
  });
}

/** Extracts the primary artist name, stripping featured artists. */
function primaryArtist(rawArtist) {
  return rawArtist
    .split(/\s+(?:featuring|feat\.?|ft\.?|&|\+|x|with)\s+/i)[0]
    .trim();
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

  return {
    name: artist.name,
    popularity: artist.popularity ?? 0,
    followers: artist.followers?.total ?? 0,
    genres: artist.genres ?? [],
    image: artist.images?.[artist.images.length - 1]?.url ?? null,
  };
}

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    const chart = await fetchHot100();

    // Deduplicate primary artist names from the chart
    const seen = new Set();
    const artistNames = [];
    for (const song of chart.songs) {
      const name = primaryArtist(song.artist);
      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        artistNames.push(name);
      }
    }

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
