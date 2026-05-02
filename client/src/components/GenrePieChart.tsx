import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#1db954', '#1ed760', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export function GenrePieChart({ genres }: { genres: { genre: string; count: number }[] }) {
  if (genres.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500">No genre data available.</p>
    );
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
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#18181b', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#fff', fontSize: 12 }}
            itemStyle={{ color: '#1db954' }}
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
