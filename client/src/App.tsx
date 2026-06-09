import { useState } from 'react';
import { useSpotifyAuth } from './hooks';
import { buildSpotifyAuthUrl } from './api';
import { LandingPage } from './components/landing';
import { Dashboard, ShareModal, QRScannerModal, TasteMatchModal } from './components/dashboard';

interface TasteMatchState {
  encodedPayload: string;
  theirSpotifyId: string;
}

const NAV_ITEMS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Recent Plays', href: '#recent-plays' },
  { label: 'Listening Clock', href: '#listening-clock' },
  { label: 'Marathons', href: '#listening-marathons' },
  { label: 'Artist Obsessions', href: '#artist-obsessions' },
  { label: 'Discovery Rate', href: '#discovery-rate' },
  { label: 'Billboard', href: '#billboard' },
];

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
    displayName,
    token: _token,
  } = useSpotifyAuth();

  const [shareOpen, setShareOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [tasteMatch, setTasteMatch] = useState<TasteMatchState | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleTasteMatch(encodedPayload: string, theirSpotifyId: string) {
    setTasteMatch({ encodedPayload, theirSpotifyId });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">Loading your tracks…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LandingPage loginUrl={buildSpotifyAuthUrl()} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Sticky top navbar */}
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <img src="/Soleri.svg" alt="Soleri" className="h-7 w-7 rounded-md" />
            <span className="font-bold tracking-tight">Soleri</span>
          </div>
          {/* Mobile sections dropdown trigger - hidden on desktop */}
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            className="flex items-center justify-center rounded-lg border border-zinc-700 p-2 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {displayName && (
            <p className="hidden text-sm text-zinc-500 sm:block lg:block">
              Welcome back{' '}
              <span className="ml-2 font-medium uppercase tracking-wide text-zinc-300">{displayName}</span>
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScanOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              aria-label="Scan QR code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
              </svg>
              Scan
            </button>
            {spotifyId && (
              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-green-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 lg:hidden">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              Dashboard
            </p>
            <div className="grid grid-cols-2 gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Left sidebar nav — desktop only */}
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-52 shrink-0 overflow-y-auto border-r border-zinc-800 py-6 lg:block">
          <nav className="flex flex-col gap-0.5 px-3">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              Dashboard
            </p>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 pb-16 pt-8 sm:px-8">
          <Dashboard
            topTracks={topTracks}
            topArtists={topArtists}
            recentPlays={recentPlays}
            playCounts={playCounts}
            genreCounts={genreCounts}
            billboard={billboard}
            billboardLoading={billboardLoading}
          />
        </main>
      </div>

      {scanOpen && (
        <QRScannerModal
          onClose={() => setScanOpen(false)}
          onTasteMatch={handleTasteMatch}
        />
      )}
      {shareOpen && spotifyId && (
        <ShareModal
          spotifyId={spotifyId}
          displayName={displayName ?? spotifyId}
          topArtists={topArtists}
          topTracks={topTracks}
          genreCounts={genreCounts}
          onClose={() => setShareOpen(false)}
        />
      )}
      {tasteMatch && (
        <TasteMatchModal
          encodedPayload={tasteMatch.encodedPayload}
          theirSpotifyId={tasteMatch.theirSpotifyId}
          myDisplayName={displayName ?? 'You'}
          myTopArtists={topArtists}
          myTopTracks={topTracks}
          myGenreCounts={genreCounts}
          onClose={() => setTasteMatch(null)}
        />
      )}
    </div>
  );
}
