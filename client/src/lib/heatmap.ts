import type { RecentPlay } from '../types/spotify';

/** A 7x24 listening heatmap with derived pattern summaries. */
export interface HeatmapData {
  /** grid[day][hour] = number of plays started in that slot (day 0 = Sunday). */
  grid: number[][];
  max: number;
  total: number;
  focus: number; // plays during 09:00–17:59
  windDown: number; // plays during 18:00–23:59
  lateNight: number; // plays during 00:00–08:59
  peakDay: number;
  peakHour: number;
}

/** Buckets recent plays into an hour-by-day grid and summarises the pattern. */
export function buildHeatmap(plays: RecentPlay[]): HeatmapData {
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const play of plays) {
    const date = new Date(play.played_at);
    if (Number.isNaN(date.getTime())) continue;
    grid[date.getDay()][date.getHours()] += 1;
  }

  const flat = grid.flat();
  const max = Math.max(1, ...flat);
  const total = flat.reduce((sum, n) => sum + n, 0);

  let focus = 0;
  let windDown = 0;
  let lateNight = 0;
  let peakDay = 0;
  let peakHour = 0;
  let peakCount = 0;
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const count = grid[day][hour];
      if (hour >= 9 && hour < 18) focus += count;
      else if (hour >= 18) windDown += count;
      else lateNight += count;
      if (count > peakCount) {
        peakCount = count;
        peakDay = day;
        peakHour = hour;
      }
    }
  }

  return { grid, max, total, focus, windDown, lateNight, peakDay, peakHour };
}
