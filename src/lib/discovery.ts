import type { RecentPlay } from '../types';
import { formatShortDate } from './format';

const DAY_MS = 24 * 60 * 60 * 1000;
// Switch from daily to weekly buckets when the history spans more than 21 days
const WEEKLY_SPAN_DAYS = 21;

// New vs replayed plays for a single time bucket (a day or a week)
export interface DiscoveryBucket {
  key: number;    // Timestamp used to sort and identify the bucket
  label: string;  // Readable date shown on the chart axis
  new: number;      // Tracks heard for the first time in this period
  replayed: number; // Tracks the user has played before
  rate: number;     // Percentage of plays that were new (0-100)
}

// Full breakdown returned to the chart component
export interface DiscoverySummary {
  buckets: DiscoveryBucket[];
  weekly: boolean;    // true = buckets are weeks, false = days
  overallRate: number; // % of all plays that were a unique track
  newTracks: number;
  newArtists: number;
  totalPlays: number;
}

// Snap a timestamp back to midnight so plays on the same day share a bucket key
function startOfDay(ts: number): number {
  const date = new Date(ts);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

// Snap to the Monday of the week, so weekly buckets always start on Monday
function startOfWeek(ts: number): number {
  const date = new Date(startOfDay(ts));
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  return date.getTime();
}

// Goes through the play history in order and marks each play as "new" or "replayed"
export function analyseDiscovery(plays: RecentPlay[]): DiscoverySummary {
  const sorted = plays
    .filter((p) => !Number.isNaN(new Date(p.played_at).getTime()))
    .sort(
      (a, b) =>
        new Date(a.played_at).getTime() - new Date(b.played_at).getTime(),
    );

  const empty: DiscoverySummary = {
    buckets: [],
    weekly: false,
    overallRate: 0,
    newTracks: 0,
    newArtists: 0,
    totalPlays: 0,
  };
  if (sorted.length === 0) return empty;

  const first = new Date(sorted[0].played_at).getTime();
  const last = new Date(sorted[sorted.length - 1].played_at).getTime();
  const weekly = (last - first) / DAY_MS > WEEKLY_SPAN_DAYS;

  const seenTracks = new Set<string>();
  const seenArtists = new Set<string>();
  const buckets = new Map<number, DiscoveryBucket>();

  for (const play of sorted) {
    const ts = new Date(play.played_at).getTime();
    const key = weekly ? startOfWeek(ts) : startOfDay(ts);
    const bucket =
      buckets.get(key) ??
      {
        key,
        label: formatShortDate(key),
        new: 0,
        replayed: 0,
        rate: 0,
      };

    const trackId = play.track?.id;
    if (trackId && !seenTracks.has(trackId)) {
      // If it is first time the song track appears, then it will label as discovery
      seenTracks.add(trackId);
      bucket.new += 1;
    } else {
      bucket.replayed += 1;
    }
    for (const artist of play.track?.artists ?? []) {
      if (artist.id) seenArtists.add(artist.id);
    }
    buckets.set(key, bucket);
  }

  // Calculate the discovery rate (%) for each bucket
  const ordered = [...buckets.values()].sort((a, b) => a.key - b.key);
  for (const bucket of ordered) {
    const total = bucket.new + bucket.replayed;
    bucket.rate = total === 0 ? 0 : Math.round((bucket.new / total) * 100);
  }

  return {
    buckets: ordered,
    weekly,
    overallRate: Math.round((seenTracks.size / sorted.length) * 100),
    newTracks: seenTracks.size,
    newArtists: seenArtists.size,
    totalPlays: sorted.length,
  };
}
