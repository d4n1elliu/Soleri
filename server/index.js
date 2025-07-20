require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 8888;

app.use('/callback', authRoutes);

// Used to confirm my .env variable is loaded in
app.get('/env-check', (req, res) => {
  res.json({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    secretExists: !!process.env.SPOTIFY_CLIENT_SECRET,
    redirectURI: process.env.REDIRECT_URI
  });
});

// Root route for Azure
app.get('/', (req, res) => {
  res.send('Spoti-List backend is running on Azure!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
