import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { RecentPlay } from '../types/spotify';

const DAY_MS = 24 * 60 * 60 * 1000;
// Above this history span the chart switches from daily to weekly buckets.
const WEEKLY_SPAN_DAYS = 21;

interface Bucket {
  key: number;
  label: string;
  new: number;
  replayed: number;
  rate: number;
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

function formatLabel(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

interface DiscoverySummary {
  buckets: Bucket[];
  weekly: boolean;
  overallRate: number;
  newTracks: number;
  newArtists: number;
  totalPlays: number;
}

function analyseDiscovery(plays: RecentPlay[]): DiscoverySummary {
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
  const buckets = new Map<number, Bucket>();

  for (const play of sorted) {
    const ts = new Date(play.played_at).getTime();
    const key = weekly ? startOfWeek(ts) : startOfDay(ts);
    const bucket =
      buckets.get(key) ??
      ({ key, label: formatLabel(key), new: 0, replayed: 0, rate: 0 } as Bucket);

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

export function DiscoveryRateChart({ plays }: { plays: RecentPlay[] }) {
  const { buckets, weekly, overallRate, newTracks, newArtists, totalPlays } =
    analyseDiscovery(plays);

  if (buckets.length === 0) {
    return (
      <section className="rounded-xl bg-zinc-800 p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
          Discovery Rate
        </h3>
        <p className="text-center text-sm text-zinc-500">
          No listening history to chart yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-zinc-800 p-6">
      <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Discovery Rate
      </h3>
      <p className="mb-5 text-xs text-zinc-500">
        New finds vs. replayed favourites, {weekly ? 'per week' : 'per day'} ·
        last {totalPlays} plays
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={buckets} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#27272a" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 11 }} />
          <YAxis
            yAxisId="count"
            allowDecimals={false}
            tick={{ fill: '#71717a', fontSize: 11 }}
          />
          <YAxis
            yAxisId="rate"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickFormatter={(value: number) => `${value}%`}
          />
          <Tooltip
            contentStyle={{ background: '#18181b', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#fff', fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            formatter={(value: number, name: string) =>
              name === 'Discovery rate' ? [`${value}%`, name] : [value, name]
            }
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#a1a1aa', fontSize: 12 }}>{value}</span>
            )}
          />
          <Bar
            yAxisId="count"
            dataKey="new"
            name="New"
            stackId="plays"
            fill="#1db954"
          />
          <Bar
            yAxisId="count"
            dataKey="replayed"
            name="Replayed"
            stackId="plays"
            fill="#3f3f46"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="rate"
            dataKey="rate"
            name="Discovery rate"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 3, fill: '#8b5cf6' }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Discovery rate</p>
          <p className="mt-1 text-sm font-semibold text-purple-400">
            {overallRate}%
          </p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">New tracks</p>
          <p className="mt-1 text-sm font-semibold text-green-400">
            {newTracks}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Artists explored</p>
          <p className="mt-1 text-sm font-semibold text-white">{newArtists}</p>
        </div>
      </div>
    </section>
  );
}
