// Shared colours and chart styles for the dashboard
export const SPOTIFY_GREEN = '#1db954';

// Grey for bars that aren't highlighted
export const NEUTRAL_FILL = '#3f3f46';

// Colours for multi slice charts like the genre pie
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

// Dark tooltip style for every chart
export const TOOLTIP_CONTENT_STYLE = {
  background: '#18181b',
  border: 'none',
  borderRadius: 8,
};

export const TOOLTIP_LABEL_STYLE = { color: '#ffffff', fontSize: 12 };

// Spotify green with adjustable transparency, for heatmap shading
export function greenWithAlpha(alpha: number): string {
  return `rgba(29, 185, 84, ${alpha})`;
}
