import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = req.query['code'];
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.REDIRECT_URI ?? '',
    client_id: process.env.SPOTIFY_CLIENT_ID ?? '',
    client_secret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
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
    console.error('Token exchange error:', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
}
