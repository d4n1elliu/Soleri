import type { RecentPlay, SpotifyTopArtist } from '../types/spotify';

// An artist needs at least this many plays in recent history to count as a phase.
const MIN_PLAYS = 3;
// If an artist's last play sits this far back in the overall window, the
// obsession is treated as having faded out.
const FADE_THRESHOLD = 0.4;

interface ObsessionPhase {
  artistId: string;
  name: string;
  count: number;
  first: number;
  last: number;
  peak: number;
  faded: boolean;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/** Detects artists played heavily over a window, ranked by play count. */
function buildPhases(plays: RecentPlay[]): {
  phases: ObsessionPhase[];
  start: number;
  span: number;
} {
  const times: number[] = [];
  const byArtist = new Map<string, { name: string; times: number[] }>();

  for (const play of plays) {
    const ts = new Date(play.played_at).getTime();
    if (Number.isNaN(ts)) continue;
    times.push(ts);
    for (const artist of play.track?.artists ?? []) {
      if (!artist.id) continue;
      const entry = byArtist.get(artist.id) ?? { name: artist.name, times: [] };
      entry.times.push(ts);
      byArtist.set(artist.id, entry);
    }
  }

  if (times.length === 0) return { phases: [], start: 0, span: 1 };

  const start = Math.min(...times);
  const end = Math.max(...times);
  const span = Math.max(1, end - start);

  const phases: ObsessionPhase[] = [];
  for (const [artistId, entry] of byArtist) {
    if (entry.times.length < MIN_PLAYS) continue;
    const sorted = [...entry.times].sort((a, b) => a - b);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    // Peak day: the calendar day this artist was played most.
    const dayCounts = new Map<string, { count: number; ts: number }>();
    for (const ts of sorted) {
      const key = new Date(ts).toDateString();
      const day = dayCounts.get(key) ?? { count: 0, ts };
      day.count += 1;
      dayCounts.set(key, day);
    }
    let peak = first;
    let peakCount = 0;
    for (const day of dayCounts.values()) {
      if (day.count > peakCount) {
        peakCount = day.count;
        peak = day.ts;
      }
    }

    phases.push({
      artistId,
      name: entry.name,
      count: sorted.length,
      first,
      last,
      peak,
      faded: end - last > FADE_THRESHOLD * span,
    });
  }

  phases.sort((a, b) => b.count - a.count);
  return { phases: phases.slice(0, 6), start, span };
}

export function ArtistObsessionPhases({
  plays,
  topArtists,
}: {
  plays: RecentPlay[];
  topArtists: SpotifyTopArtist[];
}) {
  const { phases, start, span } = buildPhases(plays);
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
                <span>{formatDate(phase.first)}</span>
                <span className="text-zinc-400">
                  Peak {formatDate(phase.peak)}
                </span>
                <span>{formatDate(phase.last)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
