import type { SpotifyTrack } from '../../types';
import { formatTrackLength } from '../../lib';

// Large card for the user's #1 most listened track and directly links to Spotify
export function TopTrackCard({ track }: { track: SpotifyTrack }) {
  const artists = track.artists.map((a) => a.name).join(', ');
  const duration = formatTrackLength(track.duration_ms);

  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl bg-zinc-800 p-4 shadow transition-colors hover:bg-zinc-700"
    >
      {/* Mobile (< sm): compact horizontal layout so the image doesn't dominate the screen */}
      <div className="flex items-center gap-4 sm:hidden">
        <img
          src={track.album.images[0]?.url}
          alt={track.album.name}
          className="h-20 w-20 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-green-400">#1 Top Track</p>
          <h2 className="mt-0.5 text-base font-semibold text-white">{track.name}</h2>
          <p className="mt-0.5 truncate text-xs text-zinc-400">{artists}</p>
          <p className="mt-1 text-xs text-zinc-500">Duration: {duration}</p>
        </div>
      </div>

      {/* sm+: original vertical full-image layout */}
      <div className="hidden sm:block">
        <img
          src={track.album.images[0]?.url}
          alt={track.album.name}
          className="mb-3 w-full rounded-lg object-cover"
        />
        <p className="text-xs font-medium uppercase tracking-widest text-green-400">#1 Top Track</p>
        <h2 className="mt-1 text-lg font-semibold text-white">{track.name}</h2>
        <p className="mt-0.5 text-sm text-zinc-400">{artists}</p>
        <p className="mt-2 text-xs text-zinc-500">Duration: {duration}</p>
      </div>
    </a>
  );
}
