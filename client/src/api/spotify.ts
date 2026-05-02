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

export async function fetchRecentlyPlayed(token: string): Promise<Record<string, number>> {
  const res = await fetch('/api/recently_played_song', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return {};
  const data = await res.json();
  const counts: Record<string, number> = {};
  for (const item of data.items ?? []) {
    const id = item.track.id;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
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
      scope: 'user-read-email user-top-read user-read-recently-played',
    })
  );
}
