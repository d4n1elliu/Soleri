import type { RecentPlay } from '../types';

// A 7x24 grid (days × hours) of play counts, plus some handy summary numbers
export interface HeatmapData {
  grid: number[][];  // grid[day][hour] = plays in that slot (day 0 = Sunday)
  max: number;       // highest count in any single cell, used to scale the colours
  total: number;
  focus: number;     // plays during 9am–6pm (work hours)
  windDown: number;  // plays during 6pm–midnight
  lateNight: number; // plays during midnight–9am
  peakDay: number;   // day index (0=Sun) with the single busiest hour
  peakHour: number;  // hour (0-23) that had the most plays
}

// Slots each recent play into the right cell of the 7×24 grid
export function buildHeatmap(plays: RecentPlay[]): HeatmapData {
  // Start with a 7×24 grid of zeros
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));

  for (const play of plays) {
    const date = new Date(play.played_at);
    if (Number.isNaN(date.getTime())) continue;
    grid[date.getDay()][date.getHours()] += 1;
  }

  const flat = grid.flat();
  const max = Math.max(1, ...flat); // at least 1 to avoid dividing by zero
  const total = flat.reduce((sum, n) => sum + n, 0);

  // Tally time-of-day buckets and find the single busiest slot
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
