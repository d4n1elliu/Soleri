import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  CHART_COLORS,
  SPOTIFY_GREEN,
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_LABEL_STYLE,
} from '../../lib/theme';

export function GenrePieChart({ genres }: { genres: { genre: string; count: number }[] }) {
  if (genres.length === 0) {
    return <p className="text-center text-sm text-zinc-500">No genre data available.</p>;
  }

  const data = genres.map((g) => ({ name: g.genre, value: g.count }));

  return (
    <div className="rounded-xl bg-zinc-800 p-6">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Top Genres
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius={100}
            dataKey="value"
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
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
