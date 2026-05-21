import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SpotifyTrack } from '../../types';
import {
  SPOTIFY_GREEN,
  NEUTRAL_FILL,
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_LABEL_STYLE,
} from '../../lib';

export function PopularityBarChart({ tracks }: { tracks: SpotifyTrack[] }) {
  const data = tracks.map((track) => ({
    name: track.name,
    popularity: track.popularity,
  }));

  return (
    <div className="rounded-xl bg-zinc-800 p-4">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Popularity
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" hide />
          <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 11 }} />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            itemStyle={{ color: SPOTIFY_GREEN }}
            formatter={(value: number) => [`${value}/100`, 'Popularity']}
          />
          <Bar dataKey="popularity" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? SPOTIFY_GREEN : NEUTRAL_FILL} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
