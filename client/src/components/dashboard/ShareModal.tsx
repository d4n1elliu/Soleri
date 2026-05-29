import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface ShareModalProps {
  spotifyId: string; // e.g. "smedjan"
  onClose: () => void;
}

export function ShareModal({ spotifyId, onClose }: ShareModalProps) {
  // Starts empty and filled in once the QR library finishes generating the image
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://soleri.app/u/${spotifyId}`;

  // Generate the QR as a base64 PNG; white on dark so it fits the modal
  useEffect(() => {
    QRCode.toDataURL(profileUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#ffffff', light: '#27272a' },
    }).then(setQrDataUrl);
  }, [profileUrl]);

  // Copy to clipboard and then briefly show a checkmark
  function copyUrl() {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Create a hidden <a> pointing at the base64 PNG and click it to trigger a download
  function downloadQr() {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `soleri-${spotifyId}.png`;
    a.click();
  }

  return (
    // Clicking on the dark backdrop closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      {/* Stop clicks inside the card from bubbling up to the backdrop */}
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

        {/* Pulsing placeholder while the QR is generating */}
        <div className="mb-5 flex justify-center">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Profile QR code"
              className="rounded-lg"
              width={200}
              height={200}
            />
          ) : (
            <div className="h-[200px] w-[200px] rounded-lg bg-zinc-700 animate-pulse" />
          )}
        </div>

        {/* In URL row, the icon swaps to a tick after copying */}
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

        {/* Disabling the QR code until it is ready as you can't download a blank image */}
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
