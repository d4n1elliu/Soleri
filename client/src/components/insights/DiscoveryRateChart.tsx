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
import type { RecentPlay } from '../../types';
import {
  analyseDiscovery,
  SPOTIFY_GREEN,
  NEUTRAL_FILL,
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_LABEL_STYLE,
} from '../../lib';

const DISCOVERY_LINE = '#8b5cf6';

export function DiscoveryRateChart({ plays }: { plays: RecentPlay[] }) {
  const { buckets, weekly, overallRate, newTracks, newArtists, totalPlays } =
    analyseDiscovery(plays);

  if (buckets.length === 0) {
    return (
      <section className="rounded-2xl bg-zinc-900 p-4 ring-1 ring-zinc-800 sm:p-7">
        <h3 className="mb-1 text-base font-semibold text-white">
          Discovery Rate
        </h3>
        <p className="text-center text-sm text-zinc-500">
          No listening history to chart yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-zinc-900 p-4 ring-1 ring-zinc-800 sm:p-7">
      <h3 className="mb-1 text-base font-semibold text-white">
        Discovery Rate
      </h3>
      <p className="mb-5 text-xs text-zinc-500">
        New finds vs replayed favourites {weekly ? 'per week' : 'per day'} ·
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
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
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
            fill={SPOTIFY_GREEN}
          />
          <Bar
            yAxisId="count"
            dataKey="replayed"
            name="Replayed"
            stackId="plays"
            fill={NEUTRAL_FILL}
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="rate"
            dataKey="rate"
            name="Discovery rate"
            stroke={DISCOVERY_LINE}
            strokeWidth={2}
            dot={{ r: 3, fill: DISCOVERY_LINE }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-lg bg-zinc-800 p-3">
          <p className="text-xs text-zinc-500">Discovery rate</p>
          <p className="mt-1 text-sm font-semibold text-purple-400">
            {overallRate}%
          </p>
        </div>
        <div className="rounded-lg bg-zinc-800 p-3">
          <p className="text-xs text-zinc-500">New tracks</p>
          <p className="mt-1 text-sm font-semibold text-green-400">
            {newTracks}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-800 p-3">
          <p className="text-xs text-zinc-500">Artists explored</p>
          <p className="mt-1 text-sm font-semibold text-white">{newArtists}</p>
        </div>
      </div>
    </section>
  );
}
