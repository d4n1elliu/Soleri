import type { RecentPlay } from '../../types';
import { buildHeatmap, formatHour, greenWithAlpha } from '../../lib';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOUR_LABELS = [0, 3, 6, 9, 12, 15, 18, 21];
const EMPTY_CELL = '#27272a';

export function ListeningHeatmap({ plays }: { plays: RecentPlay[] }) {
  const { grid, max, total, focus, windDown, lateNight, peakDay, peakHour } =
    buildHeatmap(plays);

  if (total === 0) {
    return (
      <section className="rounded-xl bg-zinc-800 p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
          Listening Clock
        </h3>
        <p className="text-center text-sm text-zinc-500">
          No recent listening history to map yet.
        </p>
      </section>
    );
  }

  const pct = (value: number) => Math.round((value / total) * 100);

  return (
    <section className="rounded-xl bg-zinc-800 p-6">
      <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Listening Clock
      </h3>
      <p className="mb-5 text-xs text-zinc-500">
        When you listen, across hours and days · last {total} plays
      </p>

      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Hour axis */}
          <div
            className="grid text-[10px] text-zinc-500"
            style={{ gridTemplateColumns: '34px repeat(24, 1fr)' }}
          >
            <span />
            {Array.from({ length: 24 }, (_, hour) => (
              <span key={hour} className="text-center">
                {HOUR_LABELS.includes(hour) ? formatHour(hour) : ''}
              </span>
            ))}
          </div>

          {/* Day rows */}
          {grid.map((row, day) => (
            <div
              key={day}
              className="grid items-center"
              style={{ gridTemplateColumns: '34px repeat(24, 1fr)' }}
            >
              <span className="pr-2 text-right text-[11px] text-zinc-500">
                {DAYS[day]}
              </span>
              {row.map((count, hour) => {
                const intensity = count === 0 ? 0 : 0.15 + 0.85 * (count / max);
                return (
                  <div
                    key={hour}
                    title={`${DAYS[day]} ${formatHour(hour)} — ${count} play${count === 1 ? '' : 's'}`}
                    className="m-px aspect-square rounded-[3px]"
                    style={{
                      backgroundColor:
                        count === 0 ? EMPTY_CELL : greenWithAlpha(intensity),
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500">
        <span>Less</span>
        {[0, 0.3, 0.55, 0.8, 1].map((step) => (
          <span
            key={step}
            className="h-3 w-3 rounded-[3px]"
            style={{
              backgroundColor:
                step === 0 ? EMPTY_CELL : greenWithAlpha(0.15 + 0.85 * step),
            }}
          />
        ))}
        <span>More</span>
      </div>

      {/* Pattern summary */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Peak slot</p>
          <p className="mt-1 text-sm font-semibold text-green-400">
            {DAYS[peakDay]} at {formatHour(peakHour)}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Work focus (9am–6pm)</p>
          <p className="mt-1 text-sm font-semibold text-white">{pct(focus)}%</p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500">Wind down (6pm–12am)</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {pct(windDown)}%
          </p>
        </div>
      </div>
      {lateNight > 0 && (
        <p className="mt-3 text-xs text-zinc-500">
          {pct(lateNight)}% of your listening happens late night or early
          morning (12am–9am).
        </p>
      )}
    </section>
  );
}
