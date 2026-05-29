const express = require('express');
const router = express.Router();
const { proxySpotify } = require('../lib/spotify');

// These three routes just proxy straight through to Spotify
router.get('/top-songs', (req, res) =>
  proxySpotify(req, res, 'https://api.spotify.com/v1/me/top/tracks?limit=50', 'top tracks'),
);

router.get('/top-artists', (req, res) =>
  proxySpotify(req, res, 'https://api.spotify.com/v1/me/top/artists?limit=50', 'top artists'),
);

router.get('/recently_played_song', (req, res) =>
  proxySpotify(
    req,
    res,
    'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    'recently played songs',
  ),
);

module.exports = router;
