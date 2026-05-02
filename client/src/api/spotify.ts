import type { SpotifyTrack } from '../types/spotify';

export async function exchangeCodeForToken(code: string): Promise<string | null> {
  const res = await fetch(`/api/authenticate?code=${code}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function fetchTopTracks(token: string): Promise<SpotifyTrack[]> {
  const res = await fetch('/api/top-songs', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export function buildSpotifyAuthUrl(): string {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI as string;
  return (
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'user-read-email user-top-read',
    })
  );
}
