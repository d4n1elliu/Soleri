import type { RecentPlay } from '../types';

// An artist needs at least 3 plays to be considered an obsession phase
const MIN_PLAYS = 3;
// If the artist's last play was in the oldest 40% of the history window, we say they "faded out"
const FADE_THRESHOLD = 0.4;

// A period where the user was heavily into one artist
export interface ObsessionPhase {
  artistId: string;
  name: string;
  count: number;  // total plays in the history window
  first: number;  // timestamp of the first play
  last: number;   // timestamp of the most recent play
  peak: number;   // timestamp of the day they were played most
  faded: boolean; // true if this artist hasn't been played recently
}

// The phases plus the overall history window boundaries (used to draw the timeline bar)
export interface ObsessionResult {
  phases: ObsessionPhase[];
  start: number; // earliest play timestamp in the whole history
  span: number;  // total time range in ms
}

// Looks through all plays, groups them by artist and identifies obsession phases
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

    // Find which calendar day has the most plays for a particular artist
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
      // "faded" if the artist dropped off and wasn't played again recently
      faded: end - last > FADE_THRESHOLD * span,
    });
  }

  // Show up to 6 artists and ranked by how many times they were played
  phases.sort((a, b) => b.count - a.count);
  return { phases: phases.slice(0, 6), start, span };
}
