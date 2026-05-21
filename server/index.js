require('dotenv').config();
const express = require('express');
const apiRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8888;

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
  res.send('Soleri server is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
