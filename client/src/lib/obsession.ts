import type { RecentPlay } from '../types';

// An artist needs at least this many plays in recent history to count as a phase.
const MIN_PLAYS = 3;
// If an artist's last play sits this far back in the overall window, the
// obsession is treated as having faded out.
const FADE_THRESHOLD = 0.4;

/** A detected period of heavy listening to a single artist. */
export interface ObsessionPhase {
  artistId: string;
  name: string;
  count: number;
  first: number;
  last: number;
  peak: number;
  faded: boolean;
}

/** Obsession phases plus the bounds of the overall history window. */
export interface ObsessionResult {
  phases: ObsessionPhase[];
  start: number;
  span: number;
}

/** Detects artists played heavily over a window, ranked by play count. */
export function buildObsessionPhases(plays: RecentPlay[]): ObsessionResult {
  const times: number[] = [];
  const byArtist = new Map<string, { name: string; times: number[] }>();

  for (const play of plays) {
    const ts = new Date(play.played_at).getTime();
    if (Number.isNaN(ts)) continue;
    times.push(ts);
    for (const artist of play.track?.artists ?? []) {
      if (!artist.id) continue;
      const entry = byArtist.get(artist.id) ?? { name: artist.name, times: [] };
      entry.times.push(ts);
      byArtist.set(artist.id, entry);
    }
  }

  if (times.length === 0) return { phases: [], start: 0, span: 1 };

  const start = Math.min(...times);
  const end = Math.max(...times);
  const span = Math.max(1, end - start);

  const phases: ObsessionPhase[] = [];
  for (const [artistId, entry] of byArtist) {
    if (entry.times.length < MIN_PLAYS) continue;
    const sorted = [...entry.times].sort((a, b) => a - b);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    // Peak day: the calendar day this artist was played most.
    const dayCounts = new Map<string, { count: number; ts: number }>();
    for (const ts of sorted) {
      const key = new Date(ts).toDateString();
      const day = dayCounts.get(key) ?? { count: 0, ts };
      day.count += 1;
      dayCounts.set(key, day);
    }
    let peak = first;
    let peakCount = 0;
    for (const day of dayCounts.values()) {
      if (day.count > peakCount) {
        peakCount = day.count;
        peak = day.ts;
      }
    }

    phases.push({
      artistId,
      name: entry.name,
      count: sorted.length,
      first,
      last,
      peak,
      faded: end - last > FADE_THRESHOLD * span,
    });
  }

  phases.sort((a, b) => b.count - a.count);
  return { phases: phases.slice(0, 6), start, span };
}
