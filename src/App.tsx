import { useEffect, useState } from 'react';
import { useSpotifyAuth } from './hooks';
import { buildSpotifyAuthUrl } from './api';
import { LandingPage } from './components/landing';
import { TermsPage, PrivacyPage } from './components/legal';
import { SharedProfilePage } from './components/share';
import { EditProfilePage } from './components/profile';
import { Dashboard, DashboardHeader, NAV_ITEMS, ShareModal, QRScannerModal, TasteMatchModal } from './components/dashboard';
import { encodeTasteProfile } from './lib';

interface TasteMatchState {
  encodedPayload: string;
  theirSpotifyId: string;
}


// ssrPath is provided by the build-time prerenderer (scripts/prerender.mjs),
// where window does not exist. In the browser it is always undefined.
export default function App({ ssrPath }: { ssrPath?: string }) {
  const rawPath = ssrPath ?? window.location.pathname;
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;
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
    avatarUrl,
    token,
    timeRange,
    setTimeRange,
    topsLoading,
  } = useSpotifyAuth();

  const [shareOpen, setShareOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [tasteMatch, setTasteMatch] = useState<TasteMatchState | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  // URL mirrors the editor view; a fresh load of /settings/profile lands on the landing page
  useEffect(() => {
    const onPopState = () => setEditingProfile(window.location.pathname === '/settings/profile');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function openEditProfile() {
    setShareOpen(false);
    window.history.pushState({}, '', '/settings/profile');
    setEditingProfile(true);
  }

  function closeEditProfile() {
    window.history.pushState({}, '', '/');
    setEditingProfile(false);
  }

  function handleTasteMatch(theirSpotifyId: string, theirPayload?: string) {
    const encodedPayload =
      theirPayload ??
      encodeTasteProfile(
        theirSpotifyId,
        displayName ?? theirSpotifyId,
        topArtists,
        topTracks,
        genreCounts,
      );
    setTasteMatch({ encodedPayload, theirSpotifyId });
  }

  if (path.startsWith('/u/')) {
    return <SharedProfilePage encoded={path.slice(3)} />;
  }

  if (path === '/terms') {
    return <TermsPage />;
  }

  if (path === '/privacy') {
    return <PrivacyPage />;
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
    <div className="min-h-screen overflow-x-clip bg-zinc-950 text-white">
      <DashboardHeader
        displayName={displayName}
        spotifyId={spotifyId}
        avatarUrl={avatarUrl}
        onScan={() => setScanOpen(true)}
        onShare={() => setShareOpen(true)}
        onEditProfile={openEditProfile}
      />

      {editingProfile && token && spotifyId ? (
        <EditProfilePage
          token={token}
          spotifyId={spotifyId}
          spotifyDisplayName={displayName ?? spotifyId}
          spotifyAvatarUrl={avatarUrl}
          topTracks={topTracks}
          onBack={closeEditProfile}
        />
      ) : (
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
        <main className="min-w-0 flex-1 pb-16 pt-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-8">
          <Dashboard
            topTracks={topTracks}
            topArtists={topArtists}
            recentPlays={recentPlays}
            playCounts={playCounts}
            genreCounts={genreCounts}
            billboard={billboard}
            billboardLoading={billboardLoading}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            topsLoading={topsLoading}
          />
        </main>
      </div>
      )}

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
          avatarUrl={avatarUrl}
          onEditProfile={openEditProfile}
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
