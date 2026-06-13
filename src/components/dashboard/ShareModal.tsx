import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import type { SpotifyTopArtist, SpotifyTrack } from '../../types';
import { encodeTasteProfile } from '../../lib';

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
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/u/${spotifyId}`;

  // QR URL embeds the taste payload so scanners can show a comparison view
  const tasteEncoded = encodeTasteProfile(displayName, topArtists, topTracks, genreCounts);
  const qrUrl = `${profileUrl}?p=${tasteEncoded}`;

  useEffect(() => {
    QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'L',
    }).then(setQrDataUrl);
  }, [qrUrl]);

  function copyUrl() {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQr() {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `soleri-${spotifyId}.png`;
    a.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl bg-zinc-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="font-semibold text-white">Share profile</span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 flex justify-center">
          {qrDataUrl ? (
            <div className="rounded-xl bg-white p-3">
              <img
                src={qrDataUrl}
                alt="Profile QR code"
                width={300}
                height={300}
              />
            </div>
          ) : (
            <div className="h-[324px] w-[324px] rounded-xl bg-zinc-700 animate-pulse" />
          )}
        </div>

        <p className="mb-3 text-center text-xs text-zinc-500">
          Friends who scan this will see your taste match
        </p>

        <div className="mb-3 flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-2.5">
          <span className="flex-1 truncate text-sm text-zinc-300">{profileUrl}</span>
          <button
            onClick={copyUrl}
            className="shrink-0 text-zinc-400 transition-colors hover:text-white"
            aria-label="Copy link"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        </div>

        <button
          onClick={downloadQr}
          disabled={!qrDataUrl}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-600 disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download QR
        </button>
      </div>
    </div>
  );
}
