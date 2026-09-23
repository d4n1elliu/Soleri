export async function spotifyFetch(path: string, token: string): Promise<Response> {
  return fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Writes must not trust a client-sent user ID; resolve it from the token
export async function verifySpotifyUser(token: string): Promise<string | null> {
  try {
    const resp = await spotifyFetch('/me', token);
    if (!resp.ok) return null;
    const me = (await resp.json()) as { id?: string };
    return me.id ?? null;
  } catch {
    return null;
  }
}
