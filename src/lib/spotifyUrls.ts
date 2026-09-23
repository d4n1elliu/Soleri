const SPOTIFY_USER_PREFIX = 'https://open.spotify.com/user/';

export function spotifyUserUrl(id: string): string {
  return `${SPOTIFY_USER_PREFIX}${id}`;
}

export function spotifyArtistUrl(id: string): string {
  return `https://open.spotify.com/artist/${id}`;
}

export function spotifyTrackUrl(id: string): string {
  return `https://open.spotify.com/track/${id}`;
}

export function parseSpotifyUserId(url: string): string | null {
  if (!url.startsWith(SPOTIFY_USER_PREFIX)) return null;
  const id = url.slice(SPOTIFY_USER_PREFIX.length).split('?')[0].split('/')[0];
  return id || null;
}
