import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getToken, unauthorized, serverError } from '../_lib/http.js';
import { spotifyFetch } from '../_lib/spotify.js';

const TIME_RANGES = ['short_term', 'medium_term', 'long_term'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = getToken(req);
  if (!token) return unauthorized(res);

  const range = typeof req.query.time_range === 'string' && TIME_RANGES.includes(req.query.time_range)
    ? req.query.time_range
    : 'medium_term';

  try {
    const response = await spotifyFetch(`/me/top/artists?limit=50&time_range=${range}`, token);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    serverError(res, 'fetch top artists', err);
  }
}
