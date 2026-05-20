import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { buildSpotifyAuthUrl } from './api/spotify';
import { LandingPage } from './components/LandingPage';
import { TopTrackCard } from './components/TopTrackCard';
import { TrackList } from './components/TrackList';
import { PopularityBarChart } from './components/PopularityBarChart';
import { RecentPlayCount } from './components/RecentPlayCount';
import { GenrePieChart } from './components/GenrePieChart';
import { ListeningHeatmap } from './components/ListeningHeatmap';

export default function App() {
  const { isLoggedIn, topTracks, recentPlays, playCounts, genreCounts, isLoading } =
    useSpotifyAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Loading your tracks…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-6 pb-16 pt-12 text-white">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Spoti-List</h1>
        <p className="mt-2 text-sm text-zinc-400">Your Personal Spotify Analytics Dashboard</p>
      </header>

      {!isLoggedIn ? (
        <LandingPage loginUrl={buildSpotifyAuthUrl()} />
      ) : (
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {topTracks[0] && <TopTrackCard track={topTracks[0]} />}
            <div className="relative md:col-span-1">
              <div className="hide-scrollbar absolute inset-0 overflow-y-auto">
                <TrackList tracks={topTracks.slice(1, 20)} />
              </div>
            </div>
            <div className="space-y-6">
              <PopularityBarChart tracks={topTracks.slice(0, 20)} />
              <GenrePieChart genres={genreCounts} />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-400">
              Recent Play Count
            </h2>
            <RecentPlayCount tracks={topTracks} playCounts={playCounts} />
          </div>

          <ListeningHeatmap plays={recentPlays} />
        </div>
      )}
    </div>
  );
}
