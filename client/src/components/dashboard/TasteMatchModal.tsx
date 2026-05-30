import { useEffect, useState } from 'react';
import type { SpotifyTopArtist, SpotifyTrack } from '../../types';
import {
  decodeTasteProfile,
  computeTasteMatch,
  compatibilityLabel,
  type TasteMatchResult,
} from '../../lib';

interface TasteMatchModalProps {
  encodedPayload: string;
  theirSpotifyId: string;
  myDisplayName: string;
  myTopArtists: SpotifyTopArtist[];
  myTopTracks: SpotifyTrack[];
  myGenreCounts: { genre: string; count: number }[];
  onClose: () => void;
}

function InitialAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const cls = size === 'sm' ? 'h-10 w-10 text-base' : 'h-12 w-12 text-lg';
  return (
    <div className={`${cls} flex items-center justify-center rounded-full bg-zinc-700 font-semibold text-zinc-200`}>
      {initial}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const label = compatibilityLabel(score);
  const color =
    score >= 80
      ? 'text-green-400'
      : score >= 60
        ? 'text-emerald-400'
        : score >= 40
          ? 'text-yellow-400'
          : score >= 20
            ? 'text-orange-400'
            : 'text-zinc-400';

  return (
    <div className="flex flex-col items-center gap-1 py-4">
      <span className={`text-6xl font-bold tabular-nums ${color}`}>{score}</span>
      <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
        compatibility
      </span>
      <span className={`text-sm font-semibold ${color}`}>{label}</span>
    </div>
  );
}

export function TasteMatchModal({
  encodedPayload,
  theirSpotifyId: _theirSpotifyId,
  myDisplayName,
  myTopArtists,
  myTopTracks,
  myGenreCounts,
  onClose,
}: TasteMatchModalProps) {
  const [result, setResult] = useState<TasteMatchResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const payload = decodeTasteProfile(encodedPayload);
    if (!payload) {
      setError(true);
      return;
    }
    setResult(computeTasteMatch(payload, myTopArtists, myTopTracks, myGenreCounts));
  }, [encodedPayload, myTopArtists, myTopTracks, myGenreCounts]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <span className="font-semibold text-white">Taste Match</span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="px-5 pb-5 pt-3 text-center text-sm text-zinc-400">
            Couldn't read taste data from this QR code.
          </div>
        ) : !result ? (
          <div className="px-5 pb-5 pt-3 text-center text-sm text-zinc-400">Computing…</div>
        ) : (
          <div className="px-5 pb-6 space-y-5">
            {/* Both users */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex flex-1 flex-col items-center gap-1.5">
                <InitialAvatar name={myDisplayName} />
                <span className="max-w-[80px] truncate text-center text-xs text-zinc-300">
                  {myDisplayName}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <div className="flex flex-1 flex-col items-center gap-1.5">
                <InitialAvatar name={result.themName} />
                <span className="max-w-[80px] truncate text-center text-xs text-zinc-300">
                  {result.themName}
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="rounded-xl bg-zinc-900 px-4">
              <ScoreRing score={result.compatibilityScore} />
            </div>

            {/* Shared artists */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Shared Artists{result.sharedArtists.length > 0 ? ` · ${result.sharedArtists.length}` : ''}
              </p>
              {result.sharedArtists.length === 0 ? (
                <p className="text-sm text-zinc-500">No shared artists yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.sharedArtists.map((artist) => (
                    <a
                      key={artist.id}
                      href={artist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-zinc-700 pl-1 pr-3 py-1 transition-colors hover:bg-zinc-600"
                    >
                      {artist.images[0]?.url ? (
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-zinc-600" />
                      )}
                      <span className="text-xs text-zinc-200">{artist.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Genre overlap */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Genre Overlap
                </p>
                <span className="text-xs font-semibold text-zinc-300">
                  {result.genreOverlapPct}%
                </span>
              </div>
              <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-700">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-700"
                  style={{ width: `${result.genreOverlapPct}%` }}
                />
              </div>
              {result.sharedGenres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {result.sharedGenres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-zinc-700 px-2 py-0.5 text-xs capitalize text-zinc-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Shared top track */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Top Shared Track
              </p>
              {!result.sharedTopTrack ? (
                <p className="text-sm text-zinc-500">No tracks in common yet</p>
              ) : (
                <SharedTrackCard track={result.sharedTopTrack} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SharedTrackCard({ track }: { track: SpotifyTrack }) {
  const albumImg = track.album.images[0]?.url;
  const artistName = track.artists.map((a) => a.name).join(', ');
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl bg-zinc-700 p-3 transition-colors hover:bg-zinc-600"
    >
      {albumImg ? (
        <img src={albumImg} alt={track.album.name} className="h-12 w-12 rounded-lg object-cover" />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-zinc-600" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{track.name}</p>
        <p className="truncate text-xs text-zinc-400">{artistName}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
      </svg>
    </a>
  );
}
