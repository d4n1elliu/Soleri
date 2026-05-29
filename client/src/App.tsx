import { useState } from 'react';
import { useSpotifyAuth } from './hooks';
import { buildSpotifyAuthUrl } from './api';
import { LandingPage } from './components/landing';
import { Dashboard, ShareModal } from './components/dashboard';

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

  // Show a spinner while the initial Spotify data is loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Loading your tracks…</p>
      </div>
    );
  }

  // If user not logged in, then Sshow the marketing landing page
  if (!isLoggedIn) {
    return <LandingPage loginUrl={buildSpotifyAuthUrl()} />;
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-3 pb-16 pt-6 text-white sm:px-6 sm:pt-12">
      <header className="relative mb-8 text-center sm:mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Soleri</h1>
        <p className="mt-2 text-sm text-zinc-400">Your Personal Spotify Analytics Dashboard</p>

        {/* Wait for the Spotify ID before showing the Share button */}
        {spotifyId && (
          <button
            onClick={() => setShareOpen(true)}
            className="absolute right-0 top-0 flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>
        )}
      </header>

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
