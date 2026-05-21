import type { BillboardData, SpotifyTopArtist, SpotifyTrack } from '../../types';
import { SPOTIFY_GREEN } from '../../lib';

interface Props {
  billboard: BillboardData | null;
  billboardLoading: boolean;
  topArtists: SpotifyTopArtist[];
  topTracks: SpotifyTrack[];
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

  const userAvgPopularity =
    topTracks.length > 0
      ? Math.round(topTracks.reduce((s, t) => s + t.popularity, 0) / topTracks.length)
      : 0;

  const billboardNames = new Set(billboard.artists.map((a) => a.name.toLowerCase()));
  const matchedArtists = topArtists.filter((a) => billboardNames.has(a.name.toLowerCase()));
  const overlapCount = matchedArtists.length;

  const userGenreSet = new Set(topArtists.flatMap((a) => a.genres));
  const sharedGenres = billboard.genres
    .map((g) => g.genre)
    .filter((g) => userGenreSet.has(g))
    .slice(0, 8);

  const popularityDiff = userAvgPopularity - billboard.averagePopularity;
  const maxBar = Math.max(userAvgPopularity, billboard.averagePopularity, 1);

  return (
    <section className="rounded-xl bg-zinc-800 p-6">
      <h3 className="mb-1 text-sm font-medium uppercase tracking-widest text-zinc-400">
        Billboard Comparison
      </h3>
      <p className="mb-6 text-xs text-zinc-500">
        How your taste stacks up against the Billboard Hot 100
      </p>

      {/* Stat cards */}
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

      {/* Popularity bars */}
      <div className="mb-6 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          Popularity score
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-right text-xs text-zinc-400">You</span>
            <div className="flex-1 rounded-full bg-zinc-700 h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${(userAvgPopularity / maxBar) * 100}%`, backgroundColor: SPOTIFY_GREEN }}
              />
            </div>
            <span className="w-8 text-xs font-medium text-white">{userAvgPopularity}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-right text-xs text-zinc-400">Billboard</span>
            <div className="flex-1 rounded-full bg-zinc-700 h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-700 bg-zinc-400"
                style={{ width: `${(billboard.averagePopularity / maxBar) * 100}%` }}
              />
            </div>
            <span className="w-8 text-xs font-medium text-white">{billboard.averagePopularity}</span>
          </div>
        </div>
        <p className="text-xs text-zinc-500">
          {popularityDiff > 0
            ? `Your tracks run ${popularityDiff} points above the Billboard average.`
            : popularityDiff < 0
              ? `Your tracks run ${Math.abs(popularityDiff)} points below the Billboard average — you're into deeper cuts.`
              : 'Your popularity score matches the Billboard average exactly.'}
        </p>
      </div>

      {/* Matched artists */}
      {matchedArtists.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400">
            Billboard artists you listen to
          </p>
          <div className="flex flex-wrap gap-2">
            {matchedArtists.map((artist) => (
              <a
                key={artist.id}
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-zinc-700 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-zinc-600"
              >
                {artist.images[0] && (
                  <img
                    src={artist.images[artist.images.length - 1].url}
                    alt={artist.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
                <span className="text-xs font-medium text-white">{artist.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Shared genres */}
      {sharedGenres.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400">
            Genres you share with Billboard
          </p>
          <div className="flex flex-wrap gap-2">
            {sharedGenres.map((genre) => (
              <span
                key={genre}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: 'rgba(29,185,84,0.15)', color: SPOTIFY_GREEN }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
