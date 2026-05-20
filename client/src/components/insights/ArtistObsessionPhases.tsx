import type { RecentPlay, SpotifyTopArtist } from '../../types/spotify';
import { buildObsessionPhases } from '../../lib/obsession';
import { formatShortDate } from '../../lib/format';

export function ArtistObsessionPhases({
  plays,
  topArtists,
}: {
  plays: RecentPlay[];
  topArtists: SpotifyTopArtist[];
}) {
  const { phases, start, span } = buildObsessionPhases(plays);
  const artistById = new Map(topArtists.map((artist) => [artist.id, artist]));

  if (phases.length === 0) {
    return (
      <section className="rounded-xl bg-zinc-800 p-6">
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
    <section className="rounded-xl bg-zinc-800 p-6">
      <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Artist Obsession Phases
      </h3>
      <p className="mb-5 text-xs text-zinc-500">
        Artists you played heavily over a stretch of your recent history
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {phases.map((phase) => {
          const artist = artistById.get(phase.artistId);
          const image = artist?.images?.[artist.images.length - 1]?.url;
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

              {/* Timeline of where the phase sat in the overall history */}
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
