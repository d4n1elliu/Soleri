require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const spotifyRoutes = require('./routes/spotify');
const billboardRoutes = require('./routes/billboard');

const app = express();
const PORT = process.env.PORT || 8888;

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', spotifyRoutes);
app.use('/api', billboardRoutes);

app.get('/', (_req, res) => {
  res.send('Soleri server is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
