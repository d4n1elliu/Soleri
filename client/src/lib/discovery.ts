import type { RecentPlay } from '../types';
import { formatShortDate } from './format';

const DAY_MS = 24 * 60 * 60 * 1000;
// Above this history span the chart switches from daily to weekly buckets.
const WEEKLY_SPAN_DAYS = 21;

/** New vs. replayed plays for a single time bucket. */
export interface DiscoveryBucket {
  key: number;
  label: string;
  new: number;
  replayed: number;
  rate: number;
}

/** Full discovery breakdown across the recent listening history. */
export interface DiscoverySummary {
  buckets: DiscoveryBucket[];
  weekly: boolean;
  overallRate: number;
  newTracks: number;
  newArtists: number;
  totalPlays: number;
}

function startOfDay(ts: number): number {
  const date = new Date(ts);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function startOfWeek(ts: number): number {
  const date = new Date(startOfDay(ts));
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  return date.getTime();
}

/** Classifies each play as a new track or a replay and buckets it over time. */
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
