import type { SpotifyTrack, SpotifyTopArtist, RecentPlay, BillboardData } from '../types';
import { apiFetch, ApiError } from './client';

export async function exchangeCodeForToken(code: string): Promise<string | null> {
  try {
    const data = await apiFetch<{ access_token?: string }>(`/api/auth/callback?code=${code}`);
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export async function fetchTopTracks(token: string): Promise<SpotifyTrack[]> {
  try {
    const data = await apiFetch<{ items?: SpotifyTrack[] }>('/api/spotify/top-tracks', token);
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchTopArtists(token: string): Promise<SpotifyTopArtist[]> {
  try {
    const data = await apiFetch<{ items?: SpotifyTopArtist[] }>('/api/spotify/top-artists', token);
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchRecentPlays(token: string): Promise<RecentPlay[]> {
  try {
    const data = await apiFetch<{ items?: RecentPlay[] }>('/api/spotify/recently-played', token);
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchBillboard(token: string): Promise<BillboardData | null> {
  try {
    return await apiFetch<BillboardData>('/api/billboard', token);
  } catch (err) {
    if (err instanceof ApiError) return null;
    return null;
  }
}

export async function fetchUserProfile(
  token: string,
): Promise<{ id: string; display_name: string } | null> {
  try {
    return await apiFetch<{ id: string; display_name: string }>(
      'https://api.spotify.com/v1/me',
      token,
    );
  } catch {
    return null;
  }
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
