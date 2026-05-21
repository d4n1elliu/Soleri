import type { BillboardData, SpotifyTopArtist, SpotifyTrack } from '../../types';
import {
  SPOTIFY_GREEN,
  buildComparisonRows,
  computeUserAvgPopularity,
  countArtistOverlap,
} from '../../lib';

interface Props {
  billboard: BillboardData | null;
  billboardLoading: boolean;
  topArtists: SpotifyTopArtist[];
  topTracks: SpotifyTrack[];
}

function ArtistAvatar({ src, alt }: { src: string | null | undefined; alt: string }) {
  return src ? (
    <img src={src} alt={alt} className="h-8 w-8 shrink-0 rounded-full object-cover" />
  ) : (
    <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-700" />
  );
}

export function BillboardComparison({ billboard, billboardLoading, topArtists, topTracks }: Props) {
  if (billboardLoading) {
    return (
      <section className="rounded-xl bg-zinc-800 p-6">
        <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
          Billboard Comparison
        </h3>
        <p className="mt-4 text-center text-sm text-zinc-500">Loading Billboard data…</p>
      </section>
    );
  }

  if (!billboard) {
    return (
      <section className="rounded-xl bg-zinc-800 p-6">
        <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
          Billboard Comparison
        </h3>
        <p className="mt-4 text-center text-sm text-zinc-500">Billboard data unavailable.</p>
      </section>
    );
  }

  const userAvgPopularity = computeUserAvgPopularity(topTracks);
  const overlapCount = countArtistOverlap(topArtists, billboard.artists);
  const rows = buildComparisonRows(topArtists, billboard.artists, 15);
  const popularityDiff = userAvgPopularity - billboard.averagePopularity;

  return (
    <section className="rounded-xl bg-zinc-800 p-6">
      <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Billboard Comparison
      </h3>
      <p className="mb-6 text-xs text-zinc-500">
        How your taste stacks up against the Billboard Hot 100
      </p>

      {/* Summary stat cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-zinc-900 p-4 text-center">
          <p className="text-2xl font-bold text-white">{userAvgPopularity}</p>
          <p className="mt-1 text-xs text-zinc-500">Your avg popularity</p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-4 text-center">
          <p className="text-2xl font-bold text-white">{billboard.averagePopularity}</p>
          <p className="mt-1 text-xs text-zinc-500">Billboard avg</p>
        </div>
        <div className="rounded-lg bg-zinc-900 p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: SPOTIFY_GREEN }}>
            {overlapCount}
            <span className="text-base font-normal text-zinc-500"> / {billboard.artists.length}</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">Artists in common</p>
        </div>
      </div>

      {/* Side-by-side table */}
      <div className="overflow-x-auto">
        {/* Column headers */}
        <div className="mb-2 grid grid-cols-[1fr_1px_1fr] gap-0">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Your Top Artists
          </p>
          <div />
          <p className="text-right text-xs font-medium uppercase tracking-widest text-zinc-400">
            Billboard Hot 100
          </p>
        </div>

        {/* Divider */}
        <div className="mb-1 h-px bg-zinc-700" />

        {/* Rows */}
        <div className="divide-y divide-zinc-700/50">
          {rows.map((row) => {
            const highlighted = row.userIsOnBillboard || row.billboardIsInUserTop;
            return (
              <div
                key={row.rank}
                className={`grid grid-cols-[1fr_1px_1fr] items-center gap-0 py-2 ${
                  highlighted ? 'bg-green-950/20' : ''
                }`}
              >
                {/* User side */}
                <div className="flex items-center gap-2 pr-4">
                  <span className="w-5 shrink-0 text-xs text-zinc-600">{row.rank}</span>
                  <ArtistAvatar
                    src={row.userArtist?.images?.[row.userArtist.images.length - 1]?.url}
                    alt={row.userArtist?.name ?? ''}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-white">
                    {row.userArtist?.name ?? <span className="text-zinc-600">—</span>}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {row.userArtist?.popularity ?? ''}
                  </span>
                  {row.userIsOnBillboard && (
                    <span
                      className="ml-1 shrink-0 text-[10px] font-bold"
                      style={{ color: SPOTIFY_GREEN }}
                      title="This artist is on Billboard"
                    >
                      ✓
                    </span>
                  )}
                </div>

                {/* Centre divider */}
                <div className="self-stretch bg-zinc-700" />

                {/* Billboard side */}
                <div className="flex items-center gap-2 pl-4">
                  {row.billboardIsInUserTop && (
                    <span
                      className="mr-1 shrink-0 text-[10px] font-bold"
                      style={{ color: SPOTIFY_GREEN }}
                      title="You listen to this artist"
                    >
                      ✓
                    </span>
                  )}
                  <span className="shrink-0 text-xs text-zinc-400">
                    {row.billboardArtist?.popularity ?? ''}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-right text-sm text-white">
                    {row.billboardArtist?.name ?? <span className="text-zinc-600">—</span>}
                  </span>
                  <ArtistAvatar
                    src={row.billboardArtist?.image}
                    alt={row.billboardArtist?.name ?? ''}
                  />
                  <span className="w-5 shrink-0 text-right text-xs text-zinc-600">{row.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-4 text-xs text-zinc-500">
        {popularityDiff > 0
          ? `Your taste runs ${popularityDiff} pts above the Billboard average.`
          : popularityDiff < 0
            ? `Your taste runs ${Math.abs(popularityDiff)} pts below the Billboard average — you're into deeper cuts.`
            : 'Your popularity score matches the Billboard average exactly.'}
        {overlapCount > 0 && ` ✓ marks artists you share with Billboard.`}
      </p>
    </section>
  );
}
