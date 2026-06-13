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

// Small circular artist photo which falls back to a grey circle if no image
function ArtistAvatar({ src, alt }: { src: string | null | undefined; alt: string }) {
  return src ? (
    <img src={src} alt={alt} className="h-8 w-8 shrink-0 rounded-full object-cover" />
  ) : (
    <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-700" />
  );
}

// Side-by-side table comparing the user's top artists against the Billboard Hot 100.
// Rows are matched by rank (#1 vs #1, #2 vs #2), not by artist.
// A green ✓ marks any artist that appears on both lists.
export function BillboardComparison({ billboard, billboardLoading, topArtists, topTracks }: Props) {
  if (billboardLoading) {
    return (
      <section className="rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 p-6">
        <h3 className="mb-1 text-base font-semibold text-white">
          Billboard Comparison
        </h3>
        <p className="mt-4 text-center text-sm text-zinc-500">Loading Billboard data…</p>
      </section>
    );
  }

  if (!billboard) {
    return (
      <section className="rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 p-6">
        <h3 className="mb-1 text-base font-semibold text-white">
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
    <section className="rounded-2xl bg-zinc-900 ring-1 ring-zinc-800 p-4 sm:p-7">
      <h3 className="mb-1 text-base font-semibold text-white">
        Billboard Comparison
      </h3>
      <p className="mb-6 text-xs text-zinc-500">
        How your taste stacks up against the Billboard Hot 100
      </p>

      {/* Three headline stats */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="rounded-lg bg-zinc-800 p-4 text-center">
          <p className="text-2xl font-bold text-white">{userAvgPopularity}</p>
          <p className="mt-1 text-xs text-zinc-500">Your avg popularity</p>
        </div>
        <div className="rounded-lg bg-zinc-800 p-4 text-center">
          <p className="text-2xl font-bold text-white">{billboard.averagePopularity}</p>
          <p className="mt-1 text-xs text-zinc-500">Billboard avg</p>
        </div>
        <div className="rounded-lg bg-zinc-800 p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: SPOTIFY_GREEN }}>
            {overlapCount}
            <span className="text-base font-normal text-zinc-500"> / {billboard.artists.length}</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">Artists in common</p>
        </div>
      </div>

      {/* Side by side artist table */}
      <div className="overflow-x-auto">
        <div className="mb-2 grid grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] gap-0">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            Your Top Artists
          </p>
          <div />
          <p className="text-right text-xs font-medium uppercase tracking-widest text-zinc-400">
            US Billboard Hot 100
          </p>
        </div>

        {/* Column subheaders */}
        <div className="grid grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] gap-0">
          <div className="flex items-center justify-center">
            <span className="whitespace-nowrap rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              <span className="hidden sm:inline">Spotify popularity (/100)</span>
              <span className="sm:hidden">Popularity</span>
            </span>
          </div>
          <div />
          <div className="flex items-center justify-center">
            <span className="whitespace-nowrap rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              <span className="hidden sm:inline">Spotify popularity (/100)</span>
              <span className="sm:hidden">Popularity</span>
            </span>
          </div>
        </div>

        <div className="mt-2 h-px bg-zinc-700" />

        <div className="divide-y divide-zinc-700/50">
          {rows.map((row) => {
            // Highlights the row if either artist appears on both lists
            const highlighted = row.userIsOnBillboard || row.billboardIsInUserTop;
            return (
              <div
                key={row.rank}
                className={`group grid grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] items-stretch gap-0 min-h-[44px] transition-colors ${
                  highlighted ? 'bg-green-950/20 hover:bg-green-950/40' : 'hover:bg-zinc-700/30'
                }`}
              >
                {/* User side */}
                <div className="flex items-center gap-2 py-2 pr-4">
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
                  {/* ✓ = this user's artist also appears on Billboard */}
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

                {/* Vertical divider between the two columns */}
                <div className="h-full min-h-[44px] bg-zinc-600" />

                {/* Billboard side */}
                <div className="flex items-center gap-2 py-2 pl-4">
                  {/* ✓ = this Billboard artist is also in the user's top list */}
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

      {/* Explanation of how to read the table */}
      <div className="mt-5 rounded-lg bg-zinc-800 p-5">
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
              <span className="font-medium text-zinc-200">Popularity</span> is Spotify's 0–100 score (based on streams and recency), shown for both your artists and Billboard's.
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
                ? `Your average track popularity (${userAvgPopularity}) is ${popularityDiff} points above Billboard's (${billboard.averagePopularity}), your taste skews mainstream.`
                : popularityDiff < 0
                ? `Your average track popularity (${userAvgPopularity}) is ${Math.abs(popularityDiff)} points below Billboard's (${billboard.averagePopularity}), you're into the deeper cuts.`
                : `Your average track popularity (${userAvgPopularity}) matches Billboard's exactly.`}
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}