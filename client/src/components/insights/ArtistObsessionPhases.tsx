import type { RecentPlay, SpotifyTopArtist } from '../../types';
import { buildObsessionPhases, formatShortDate } from '../../lib';

// Shows artists the user went through a heavy phase with.
// Each card has a timeline bar showing when in the history the phase happened,
// and a badge saying whether the obsession is still ongoing or has faded out.
export function ArtistObsessionPhases({
  plays,
  topArtists,
}: {
  plays: RecentPlay[];
  topArtists: SpotifyTopArtist[];
}) {
  const { phases, start, span } = buildObsessionPhases(plays);

  // Build a lookup map so we can grab artist images from the top artists data
  const artistById = new Map(topArtists.map((artist) => [artist.id, artist]));

  if (phases.length === 0) {
    return (
      <section className="rounded-xl bg-zinc-800 p-3 sm:p-6">
        <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
          Artist Obsession Phases
        </h3>
        <p className="text-center text-sm text-zinc-500">
          No standout obsession phases yet — keep listening and an artist on
          repeat will show up here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-zinc-800 p-3 sm:p-6">
      <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Artist Obsession Phases
      </h3>
      <p className="mb-5 text-xs text-zinc-500">
        Artists you played heavily over a stretch of your recent history
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {phases.map((phase) => {
          const artist = artistById.get(phase.artistId);
          // Use the smallest image available to keep it crisp at the small size
          const image = artist?.images?.[artist.images.length - 1]?.url;

          // Position and width of the phase bar as a percentage of the full history window
          const leftPct = ((phase.first - start) / span) * 100;
          const widthPct = Math.max(4, ((phase.last - phase.first) / span) * 100);

          return (
            <div key={phase.artistId} className="rounded-lg bg-zinc-900 p-4">
              <div className="flex items-center gap-3">
                {image ? (
                  <img
                    src={image}
                    alt={phase.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  // Fallback: show the first letter of the artist name
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 text-base font-bold text-green-400">
                    {phase.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {phase.name}
                  </p>
                  <p className="text-xs text-zinc-500">{phase.count} plays</p>
                </div>
                {/* Amber colour for fading out and green for active music listened to */}
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    phase.faded
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-green-500/15 text-green-400'
                  }`}
                >
                  {phase.faded ? 'Faded out' : 'Ongoing'}
                </span>
              </div>

              {/* Timeline bar showing where in the history window this phase fell */}
              <div className="relative mt-4 h-1.5 rounded-full bg-zinc-800">
                <div
                  className={`absolute h-full rounded-full ${
                    phase.faded ? 'bg-amber-400' : 'bg-green-400'
                  }`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
                <span>{formatShortDate(phase.first)}</span>
                <span className="text-zinc-400">
                  Peak {formatShortDate(phase.peak)}
                </span>
                <span>{formatShortDate(phase.last)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
