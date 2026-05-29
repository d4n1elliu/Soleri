import type { SpotifyTrack, SpotifyTopArtist, RecentPlay, BillboardData } from '../types';

// Swaps the OAuth code from Spotify's redirect for an access token via our server
export async function exchangeCodeForToken(code: string): Promise<string | null> {
  const res = await fetch(`/api/authenticate?code=${code}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

// Gets the user's top 50 most-listened tracks
export async function fetchTopTracks(token: string): Promise<SpotifyTrack[]> {
  const res = await fetch('/api/top-songs', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

// Gets the user's top artists based on their listening history
export async function fetchTopArtists(token: string): Promise<SpotifyTopArtist[]> {
  const res = await fetch('/api/top-artists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

// Gets the last 50 tracks the user played, each with a timestamp
export async function fetchRecentPlays(token: string): Promise<RecentPlay[]> {
  const res = await fetch('/api/recently_played_song', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

// Gets Billboard Hot 100 artist data — resolved on the server so we can do bulk Spotify lookups
export async function fetchBillboard(token: string): Promise<BillboardData | null> {
  const res = await fetch('/api/billboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// Calls Spotify directly (not our server proxy) since we just need the user's id
export async function fetchUserProfile(token: string): Promise<{ id: string; display_name: string } | null> {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// Builds the Spotify login URL with the scopes we need
export function buildSpotifyAuthUrl(): string {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI as string;
  return (
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'user-read-email user-top-read user-read-recently-played',
    })
  );
}
