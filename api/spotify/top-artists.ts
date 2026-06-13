import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getToken, unauthorized, serverError } from '../_lib/http.js';
import { spotifyFetch } from '../_lib/spotify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = getToken(req);
  if (!token) return unauthorized(res);

  try {
    const response = await spotifyFetch('/me/top/artists?limit=50', token);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    serverError(res, 'fetch top artists', err);
  }
}
