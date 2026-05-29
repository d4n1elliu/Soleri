import type {
  SpotifyTrack,
  SpotifyTopArtist,
  RecentPlay,
  BillboardData,
} from '../types';

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

export async function fetchTopArtists(token: string): Promise<SpotifyTopArtist[]> {
  const res = await fetch('/api/top-artists', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

/** Raw recently-played history, including the `played_at` timestamp per play. */
export async function fetchRecentPlays(token: string): Promise<RecentPlay[]> {
  const res = await fetch('/api/recently_played_song', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

/** Billboard chart benchmark data, resolved server-side against Spotify. */
export async function fetchBillboard(token: string): Promise<BillboardData | null> {
  const res = await fetch('/api/billboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

/** Counts how many times each track id appears in the recent-play history. */
export function computePlayCounts(plays: RecentPlay[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const play of plays) {
    const id = play.track?.id;
    if (!id) continue;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

/** Tallies genres across the user's top artists, returning the eight largest. */
export function computeGenreCounts(
  artists: SpotifyTopArtist[],
): { genre: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const artist of artists) {
    for (const genre of artist.genres ?? []) {
      counts[genre] = (counts[genre] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function fetchUserProfile(token: string): Promise<{ id: string; display_name: string } | null> {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
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
