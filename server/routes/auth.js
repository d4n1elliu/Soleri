const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

router.get('/', async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).send('Missing code parameter.');
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Send access and refresh tokens back or save them
    res.json(response.data);
  } catch (err) {
    console.error('Token exchange error:', err.response?.data || err.message);
    res.status(500).send('Failed to exchange code for tokens');
  }
});

module.exports = router;
