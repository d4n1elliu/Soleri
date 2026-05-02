import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { buildSpotifyAuthUrl } from './api/spotify';
import { TopTrackCard } from './components/TopTrackCard';
import { TrackList } from './components/TrackList';
import { PopularityBarChart } from './components/PopularityBarChart';

export default function App() {
  const { isLoggedIn, topTracks, isLoading } = useSpotifyAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">Loading your tracks…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6 text-white">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Spoti-List</h1>
        <p className="mt-1 text-sm text-zinc-400">Your personal Spotify analytics dashboard</p>
      </header>

      {!isLoggedIn ? (
        <div className="flex justify-center">
          <a
            href={buildSpotifyAuthUrl()}
            className="rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-400"
          >
            Connect with Spotify
          </a>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {topTracks[0] && <TopTrackCard track={topTracks[0]} />}
            <div className="md:col-span-1">
              <TrackList tracks={topTracks.slice(1, 11)} />
            </div>
            <PopularityBarChart tracks={topTracks} />
          </div>
        </div>
      )}
    </div>
  );
}
