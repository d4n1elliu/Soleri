import { useState } from 'react';
import { useSpotifyAuth } from './hooks';
import { buildSpotifyAuthUrl } from './api';
import { LandingPage } from './components/landing';
import { Dashboard, ShareModal, QRScannerModal } from './components/dashboard';

// Root of the app which decides whether to show the landing page or the dashboard
export default function App() {
  const {
    isLoggedIn,
    topTracks,
    topArtists,
    recentPlays,
    playCounts,
    genreCounts,
    isLoading,
    billboard,
    billboardLoading,
    spotifyId,
  } = useSpotifyAuth();

  const [shareOpen, setShareOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);

  // Show a spinner while the initial Spotify data is loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Loading your tracks…</p>
      </div>
    );
  }

  // If user not logged in, show the marketing landing page
  if (!isLoggedIn) {
    return <LandingPage loginUrl={buildSpotifyAuthUrl()} />;
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-3 pb-16 pt-6 text-white sm:px-6 sm:pt-12">
      <header className="mb-8 sm:mb-12">
        {/* Three-column flex row: each outer col is flex-1 so the title stays exactly centred
            regardless of whether the Share button has loaded yet */}
        <div className="flex items-center">
          <div className="flex flex-1 justify-start">
            <button
              onClick={() => setScanOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              aria-label="Scan QR code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
              </svg>
              Scan
            </button>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Soleri</h1>

          <div className="flex flex-1 justify-end">
            {spotifyId && (
              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-sm text-zinc-400">Your Personal Spotify Analytics Dashboard</p>
      </header>

      {/* QR scanner modal */}
      {scanOpen && <QRScannerModal onClose={() => setScanOpen(false)} />}

      {/* Modal that shows the QR code and copyable profile link */}
      {shareOpen && spotifyId && (
        <ShareModal spotifyId={spotifyId} onClose={() => setShareOpen(false)} />
      )}

      <Dashboard
        topTracks={topTracks}
        topArtists={topArtists}
        recentPlays={recentPlays}
        playCounts={playCounts}
        genreCounts={genreCounts}
        billboard={billboard}
        billboardLoading={billboardLoading}
      />
    </div>
  );
}
