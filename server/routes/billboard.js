const express = require('express');
const router = express.Router();
const { getToken } = require('../lib/spotify');
const { fetchHot100Artists } = require('../lib/billboard');

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
        // No image usually means it's the wrong Spotify match, so skip it
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
