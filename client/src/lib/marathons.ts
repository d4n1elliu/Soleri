import type { RecentPlay } from '../types/spotify';

// Plays within this gap of the previous track ending still count as the same
// uninterrupted session.
const GAP_TOLERANCE_MS = 5 * 60 * 1000;

/** A continuous run of back-to-back plays. */
export interface Marathon {
  plays: RecentPlay[];
  start: number;
  end: number;
  totalMs: number;
}

/** Groups recent plays into continuous sessions and returns the longest five. */
export function buildMarathons(plays: RecentPlay[]): Marathon[] {
  const sorted = plays
    .filter((p) => !Number.isNaN(new Date(p.played_at).getTime()))
    .sort(
      (a, b) =>
        new Date(a.played_at).getTime() - new Date(b.played_at).getTime(),
    );

  const sessions: Marathon[] = [];
  let current: Marathon | null = null;
  let prevStart = 0;
  let prevDuration = 0;

  for (const play of sorted) {
    const start = new Date(play.played_at).getTime();
    const duration = play.track?.duration_ms ?? 0;
    const continues =
      current !== null && start - prevStart <= prevDuration + GAP_TOLERANCE_MS;

    if (continues && current) {
      current.plays.push(play);
      current.totalMs += duration;
      current.end = start + duration;
    } else {
      current = {
        plays: [play],
        start,
        end: start + duration,
        totalMs: duration,
      };
      sessions.push(current);
    }
    prevStart = start;
    prevDuration = duration;
  }

  return sessions
    .filter((session) => session.plays.length >= 2)
    .sort((a, b) => b.totalMs - a.totalMs)
    .slice(0, 5);
}
