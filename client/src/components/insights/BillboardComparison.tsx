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
        {/* Section titles */}
        <div className="mb-2 grid grid-cols-[1fr_1px_1fr] gap-0">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Your Top Artists
          </p>
          <div />
          <p className="text-right text-xs font-medium uppercase tracking-widest text-zinc-400">
            US Billboard Hot 100
          </p>
        </div>

        {/* Column sub-headers — label the numbers */}
        <div className="grid grid-cols-[1fr_1px_1fr] gap-0">
          <div className="flex items-center justify-end pr-4">
            <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              Spotify popularity (/100)
            </span>
          </div>
          <div />
          <div className="flex items-center justify-start pl-4">
            <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              Spotify popularity (/100)
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-zinc-700" />

        {/* Rows */}
        <div className="divide-y divide-zinc-700/50">
          {rows.map((row) => {
            const highlighted = row.userIsOnBillboard || row.billboardIsInUserTop;
            return (
              <div
                key={row.rank}
                className={`group grid grid-cols-[1fr_1px_1fr] items-center gap-0 py-2 transition-colors ${
                  highlighted ? 'bg-green-950/20 hover:bg-green-950/40' : 'hover:bg-zinc-700/30'
                }`}
              >
                {/* User side */}
                <div className="flex items-center gap-2 pr-4">
                  <span className="w-5 shrink-0 text-xs text-zinc-600">{row.rank}</span>
                  <a
                    href={row.userArtist?.external_urls?.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                    tabIndex={row.userArtist ? 0 : -1}
                  >
                    <ArtistAvatar
                      src={row.userArtist?.images?.[row.userArtist.images.length - 1]?.url}
                      alt={row.userArtist?.name ?? ''}
                    />
                  </a>
                  <a
                    href={row.userArtist?.external_urls?.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 truncate text-sm text-white"
                  >
                    {row.userArtist?.name ?? <span className="text-zinc-600">—</span>}
                  </a>
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
                  <a
                    href={row.billboardArtist?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 truncate text-right text-sm text-white"
                  >
                    {row.billboardArtist?.name ?? <span className="text-zinc-600">—</span>}
                  </a>
                  <a
                    href={row.billboardArtist?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                    tabIndex={row.billboardArtist ? 0 : -1}
                  >
                    <ArtistAvatar
                      src={row.billboardArtist?.image}
                      alt={row.billboardArtist?.name ?? ''}
                    />
                  </a>
                  <span className="w-5 shrink-0 text-right text-xs text-zinc-600">{row.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend and explanation */}
      <div className="mt-5 rounded-lg bg-zinc-900 p-5">
        <p className="mb-3 text-sm font-semibold text-zinc-200">Billboard Top 100 Information</p>
        <ul className="space-y-2.5 text-sm text-zinc-400">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
            <span>
              <span className="font-medium text-zinc-200">Rows are independent.</span> Your #1 sits next to Billboard's #1, then #2 next to Billboard's #2 and so on. Same rank but different artists.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
            <span>
              <span className="font-medium text-zinc-200">Pop</span> is Spotify's 0–100 popularity score, weighted by stream count and recency.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
            <span>
              <span className="font-bold" style={{ color: SPOTIFY_GREEN }}>✓</span> green check means the artist appears on both lists.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
            <span>
              {popularityDiff > 0
                ? `Your average track popularity (${userAvgPopularity}) is ${popularityDiff} points above Billboard's (${billboard.averagePopularity}) — your taste skews mainstream.`
                : popularityDiff < 0
                ? `Your average track popularity (${userAvgPopularity}) is ${Math.abs(popularityDiff)} points below Billboard's (${billboard.averagePopularity}) — you're into the deeper cuts.`
                : `Your average track popularity (${userAvgPopularity}) matches Billboard's exactly.`}
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
