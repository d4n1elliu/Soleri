import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { RecentPlay } from '../../types';
import {
  buildMarathons,
  formatDuration,
  formatWeekdayDate,
  formatClockTime,
  SPOTIFY_GREEN,
  NEUTRAL_FILL,
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_LABEL_STYLE,
} from '../../lib';

export function ListeningMarathons({ plays }: { plays: RecentPlay[] }) {
  const marathons = buildMarathons(plays);

  if (marathons.length === 0) {
    return (
      <section className="rounded-xl bg-zinc-800 p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
          Listening Marathons
        </h3>
        <p className="text-center text-sm text-zinc-500">
          No back-to-back listening sessions found in your recent history yet.
        </p>
      </section>
    );
  }

  const chartData = marathons.map((session, index) => ({
    name: `#${index + 1} · ${formatWeekdayDate(session.start)}`,
    minutes: Math.round(session.totalMs / 60000),
  }));

  return (
    <section className="rounded-xl bg-zinc-800 p-6">
      <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Listening Marathons
      </h3>
      <p className="mb-5 text-xs text-zinc-500">
        Your longest uninterrupted listening sessions, ranked by total time
      </p>

      <ResponsiveContainer width="100%" height={Math.max(150, chartData.length * 52)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickFormatter={(value: number) => `${value}m`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            itemStyle={{ color: SPOTIFY_GREEN }}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            formatter={(value: number) => [formatDuration(value * 60000), 'Listening time']}
          />
          <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={index === 0 ? SPOTIFY_GREEN : NEUTRAL_FILL} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-5 space-y-3">
        {marathons.map((session, index) => {
          const trackNames = session.plays.map((p) => p.track?.name ?? 'Unknown');
          const preview = trackNames.slice(0, 3).join(' · ');
          const remaining = trackNames.length - 3;
          return (
            <div
              key={session.start}
              className="flex items-center gap-4 rounded-lg bg-zinc-900 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-green-400">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {formatWeekdayDate(session.start)}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatClockTime(session.start)} – {formatClockTime(session.end)}
                </p>
                <p className="mt-1 truncate text-xs text-zinc-400">
                  {preview}
                  {remaining > 0 && ` +${remaining} more`}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-green-400">
                  {formatDuration(session.totalMs)}
                </p>
                <p className="text-xs text-zinc-500">
                  {session.plays.length} tracks
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
