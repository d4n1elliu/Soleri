import type { RecentPlay, SpotifyTopArtist } from '../types';

// Counts how many times each track appears in the recent play history
export function computePlayCounts(plays: RecentPlay[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const play of plays) {
    const id = play.track?.id;
    if (!id) continue;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

// Tallies genres from the user's top artists and returns the top 8
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
