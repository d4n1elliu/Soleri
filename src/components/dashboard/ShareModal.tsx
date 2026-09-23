import { useState, useEffect, useMemo } from 'react';
import type { SpotifyTopArtist, SpotifyTrack } from '../../types';
import { buildTastePayload, encodePayload, buildShareUrl } from '../../lib';
import { createShare } from '../../api';
import { InitialAvatar, StyledQr, downloadStyledQr } from '../ui';

interface ShareModalProps {
  spotifyId: string;
  displayName: string;
  topArtists: SpotifyTopArtist[];
  topTracks: SpotifyTrack[];
  genreCounts: { genre: string; count: number }[];
  onClose: () => void;
}

export function ShareModal({
  spotifyId,
  displayName,
  topArtists,
  topTracks,
  genreCounts,
  onClose,
}: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const payload = useMemo(
    () => buildTastePayload(spotifyId, displayName, topArtists, topTracks, genreCounts),
    [spotifyId, displayName, topArtists, topTracks, genreCounts],
  );

  useEffect(() => {
    let cancelled = false;
    // Long-token fallback if the share API fails
    createShare(payload).then((id) => {
      if (cancelled) return;
      const token = id ?? encodePayload(payload);
      setShareUrl(buildShareUrl(window.location.origin, token));
    });
    return () => {
      cancelled = true;
    };
  }, [payload]);

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  function copyUrl() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function nativeShare() {
    if (!shareUrl) return;
    navigator
      .share({ title: `${displayName} on Soleri`, url: shareUrl })
      .catch(() => {});
  }

  function downloadQr() {
    if (!shareUrl) return;
    downloadStyledQr(shareUrl, `soleri-${spotifyId}-qr`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-zinc-800 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold text-white">Share profile</span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Identity */}
        <div className="mb-4 flex flex-col items-center gap-2">
          <InitialAvatar name={displayName} />
          <span className="max-w-full truncate text-sm font-medium text-white">{displayName}</span>
        </div>

        {/* QR on a white card */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl bg-white p-3 shadow-lg">
            {shareUrl ? (
              <StyledQr data={shareUrl} size={560} className="h-60 w-60 sm:h-70 sm:w-70" />
            ) : (
              <div className="h-60 w-60 animate-pulse rounded-xl bg-zinc-200 sm:h-70 sm:w-70" />
            )}
          </div>
        </div>

        <p className="mb-4 text-center text-xs text-zinc-500">
          Scan with your phone camera to compare music tastes
        </p>

        {/* Link + copy */}
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-2.5">
          <span className="flex-1 truncate text-sm text-zinc-300">
            {shareUrl ?? 'Creating link…'}
          </span>
          <button
            onClick={copyUrl}
            disabled={!shareUrl}
            className="flex shrink-0 items-center gap-1 text-zinc-400 transition-colors hover:text-white disabled:opacity-40"
            aria-label="Copy share link"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-green-400">Copied</span>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {canNativeShare && (
            <button
              onClick={nativeShare}
              disabled={!shareUrl}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          )}
          <button
            onClick={downloadQr}
            disabled={!shareUrl}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-600 disabled:opacity-40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
