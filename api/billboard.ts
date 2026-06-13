import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getToken, unauthorized, serverError } from './_lib/http.js';
import { fetchHot100Artists, lookupArtist } from './_lib/billboard.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = getToken(req);
  if (!token) return unauthorized(res);

  try {
    const artistNames = await fetchHot100Artists();

    const resolved = await Promise.all(
      artistNames.map((name) => lookupArtist(name, token)),
    );

    const resolvedSeen = new Set<string>();
    const artists = resolved.filter((a): a is NonNullable<typeof a> => {
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

    const genreCounts: Record<string, number> = {};
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
    serverError(res, 'build Billboard comparison', err);
  }
}
