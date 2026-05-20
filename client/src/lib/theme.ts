/** Shared visual constants for the dashboard and charts. */

/** Spotify brand green. */
export const SPOTIFY_GREEN = '#1db954';

/** Neutral fill used for secondary chart elements. */
export const NEUTRAL_FILL = '#3f3f46';

/** Categorical palette for multi-series charts (e.g. the genre pie). */
export const CHART_COLORS = [
  '#1db954',
  '#1ed760',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#ec4899',
];

/** Recharts tooltip container styling. */
export const TOOLTIP_CONTENT_STYLE = {
  background: '#18181b',
  border: 'none',
  borderRadius: 8,
};

/** Recharts tooltip label styling. */
export const TOOLTIP_LABEL_STYLE = { color: '#ffffff', fontSize: 12 };

/** Spotify green at a given alpha, used for heatmap intensity. */
export function greenWithAlpha(alpha: number): string {
  return `rgba(29, 185, 84, ${alpha})`;
}
