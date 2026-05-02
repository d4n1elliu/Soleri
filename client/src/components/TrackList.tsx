import type { SpotifyTrack } from '../types/spotify';

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function TrackList({ tracks }: { tracks: SpotifyTrack[] }) {
  return (
    <div className="space-y-1.5">
      {tracks.map((track, index) => (
        <a
          key={track.id}
          href={track.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg bg-zinc-800 px-3 py-2.5 transition-colors hover:bg-zinc-700"
        >
          <span className="w-5 text-center text-sm text-zinc-500">{index + 2}</span>
          <img
            src={track.album.images[2]?.url ?? track.album.images[0]?.url}
            alt={track.album.name}
            className="h-10 w-10 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{track.name}</p>
            <p className="truncate text-xs text-zinc-400">
              {track.artists.map((a) => a.name).join(', ')}
            </p>
          </div>
          <span className="shrink-0 text-xs text-zinc-500">{formatDuration(track.duration_ms)}</span>
        </a>
      ))}
    </div>
  );
}
