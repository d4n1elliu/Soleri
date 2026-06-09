import type { SpotifyTrack } from '../../types';

// Shows how many times each top track appeared in the user's last 50 listens,
// sorted so the most-replayed track is at the top
export function RecentPlayCount({
  tracks,
  playCounts,
}: {
  tracks: SpotifyTrack[];
  playCounts: Record<string, number>;
}) {
  // Only include tracks that were actually played recently, then sort by play count
  const tracksWithPlays = tracks
    .filter((t) => (playCounts[t.id] ?? 0) > 0)
    .sort((a, b) => (playCounts[b.id] ?? 0) - (playCounts[a.id] ?? 0))
    .slice(0, 20);

  if (tracksWithPlays.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500">
        No recent plays found in your last 50 listens.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tracksWithPlays.map((track) => (
        <div
          key={track.id}
          className="flex items-center gap-4 rounded-lg bg-zinc-800/60 px-4 py-3 ring-1 ring-zinc-700/50"
        >
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
          {/* Play count shown on the right with a × symbol */}
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-green-400">{playCounts[track.id]}×</p>
            <p className="text-xs text-zinc-500">recent plays</p>
          </div>
        </div>
      ))}
    </div>
  );
}
