const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/authenticate', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'Missing code parameter' });

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Token exchange error:', err.response?.data ?? err.message);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});

router.get('/top-songs', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=20', {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error('Top tracks error:', err.response?.data ?? err.message);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

module.exports = router;
