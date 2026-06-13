import type { RecentPlay } from '../types';

// Two tracks are treated as the same session if the gap between them is under 5 minutes
const GAP_TOLERANCE_MS = 5 * 60 * 1000;

// A single unbroken listening session
export interface Marathon {
  plays: RecentPlay[];
  start: number;  // timestamp of the first track
  end: number;    // timestamp when the last track finished
  totalMs: number; // combined duration of all tracks
}

// Groups plays into back-to-back sessions and returns the top 5 longest
export function buildMarathons(plays: RecentPlay[]): Marathon[] {
  // Sort oldest to newest so we can walk through in order
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

    // If this track started soon after the previous one ended, extend the current session
    const continues =
      current !== null && start - prevStart <= prevDuration + GAP_TOLERANCE_MS;

    if (continues && current) {
      current.plays.push(play);
      current.totalMs += duration;
      current.end = start + duration;
    } else {
      // Start a new session 
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

  // Only keep sessions with 2+ tracks, sort longest first then show top 5
  return sessions
    .filter((session) => session.plays.length >= 2)
    .sort((a, b) => b.totalMs - a.totalMs)
    .slice(0, 5);
}
