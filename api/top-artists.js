export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error('Top artists error:', err.message);
    res.status(500).json({ error: 'Failed to fetch top artists' });
  }
}
