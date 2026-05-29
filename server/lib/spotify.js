// Pulls the Bearer token out of the Authorization header
function getToken(req) {
  return req.headers.authorization?.split(' ')[1];
}

// Forwards a request to the Spotify API and sends the response back to the client
async function proxySpotify(req, res, url, label) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error(`${label} error:`, err.message);
    res.status(500).json({ error: `Failed to fetch ${label}` });
  }
}

module.exports = { getToken, proxySpotify };
