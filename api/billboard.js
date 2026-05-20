// A representative slice of the Billboard Hot 100 / Artist 100. These names are
// resolved against the Spotify catalogue at request time so the comparison
// always uses live popularity, follower and genre data.
const BILLBOARD_ARTISTS = [
  'Taylor Swift',
  'Drake',
  'The Weeknd',
  'Bad Bunny',
  'Billie Eilish',
  'Sabrina Carpenter',
  'SZA',
  'Morgan Wallen',
  'Kendrick Lamar',
  'Post Malone',
  'Ariana Grande',
  'Olivia Rodrigo',
  'Travis Scott',
  'Doja Cat',
  'Ed Sheeran',
  'Beyoncé',
  'Dua Lipa',
  'Chappell Roan',
  'Zach Bryan',
  'Future',
  'Lana Del Rey',
  'Bruno Mars',
  'Tyla',
  'Benson Boone',
];

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
    const resolved = await Promise.all(
      BILLBOARD_ARTISTS.map((name) => lookupArtist(name, token)),
    );
    const artists = resolved.filter(Boolean);

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
