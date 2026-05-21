import type { SpotifyTrack } from '../../types';
import { formatTrackLength } from '../../lib';

export function TopTrackCard({ track }: { track: SpotifyTrack }) {
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl bg-zinc-800 p-4 shadow transition-colors hover:bg-zinc-700"
    >
      <img
        src={track.album.images[0]?.url}
        alt={track.album.name}
        className="mb-3 w-full rounded-lg object-cover"
      />
      <p className="text-xs font-medium uppercase tracking-widest text-green-400">
        #1 Top Track
      </p>
      <h2 className="mt-1 text-lg font-semibold text-white">{track.name}</h2>
      <p className="mt-0.5 text-sm text-zinc-400">
        {track.artists.map((a) => a.name).join(', ')}
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        Duration: {formatTrackLength(track.duration_ms)}
      </p>
    </a>
  );
}
