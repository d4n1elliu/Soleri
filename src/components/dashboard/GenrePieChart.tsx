import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  CHART_COLORS,
  SPOTIFY_GREEN,
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_LABEL_STYLE,
} from '../../lib';

const RADIAN = Math.PI / 180;

interface SliceLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

// Draws the percentage inside its slice so labels never overflow the card.
// Slices under 5% skip the label; the tooltip and legend still cover them.
function renderSliceLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: SliceLabelProps) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      fontSize={12}
      fontWeight={600}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// Pie chart showing the user's top 8 genres, tallied from their top artists
export function GenrePieChart({ genres }: { genres: { genre: string; count: number }[] }) {
  if (genres.length === 0) {
    return <p className="text-center text-sm text-zinc-500">No genre data available.</p>;
  }

  const data = genres.map((g) => ({ name: g.genre, value: g.count }));

  return (
    <div className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-zinc-800">
      <h3 className="mb-4 text-sm font-semibold text-white">
        Top Genres
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart style={{ outline: 'none' }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius={85}
            dataKey="value"
            label={renderSliceLabel}
            labelLine={false}
          >
            {data.map((_, i) => (
              // Cycle through the colour palette if there are more than 8 genres
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            itemStyle={{ color: SPOTIFY_GREEN }}
            formatter={(value: number, name: string) => [value, name]}
          />
          <Legend
            formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
