import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { buildSpotifyAuthUrl } from './api/spotify';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';

export default function App() {
  const {
    isLoggedIn,
    topTracks,
    topArtists,
    recentPlays,
    playCounts,
    genreCounts,
    isLoading,
  } = useSpotifyAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Loading your tracks…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LandingPage loginUrl={buildSpotifyAuthUrl()} />;
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-6 pb-16 pt-12 text-white">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Spoti-List</h1>
        <p className="mt-2 text-sm text-zinc-400">Your Personal Spotify Analytics Dashboard</p>
      </header>
      <Dashboard
        topTracks={topTracks}
        topArtists={topArtists}
        recentPlays={recentPlays}
        playCounts={playCounts}
        genreCounts={genreCounts}
      />
    </div>
  );
}
