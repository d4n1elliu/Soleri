import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SpotifyTrack } from '../types/spotify';

export function PopularityBarChart({ tracks }: { tracks: SpotifyTrack[] }) {
  const data = tracks.map((track) => ({
    name: track.name,
    popularity: track.popularity,
  }));

  return (
    <div className="flex flex-col rounded-xl bg-zinc-800 p-4">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Popularity
      </h3>
      <div className="flex-1 min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" hide />
          <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#18181b', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#fff', fontSize: 12 }}
            itemStyle={{ color: '#1db954' }}
            formatter={(value: number) => [`${value}/100`, 'Popularity']}
          />
          <Bar dataKey="popularity" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#1db954' : '#3f3f46'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
