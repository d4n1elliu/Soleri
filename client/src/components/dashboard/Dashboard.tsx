import type {
  SpotifyTrack,
  SpotifyTopArtist,
  RecentPlay,
  BillboardData,
} from '../../types';
import { TopTrackCard } from './TopTrackCard';
import { TrackList } from './TrackList';
import { PopularityBarChart } from './PopularityBarChart';
import { GenrePieChart } from './GenrePieChart';
import { RecentPlayCount } from './RecentPlayCount';
import {
  ListeningHeatmap,
  ListeningMarathons,
  ArtistObsessionPhases,
  DiscoveryRateChart,
  BillboardComparison,
} from '../insights';

interface DashboardProps {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyTopArtist[];
  recentPlays: RecentPlay[];
  playCounts: Record<string, number>;
  genreCounts: { genre: string; count: number }[];
  billboard: BillboardData | null;
  billboardLoading: boolean;
}

export function Dashboard({
  topTracks,
  topArtists,
  recentPlays,
  playCounts,
  genreCounts,
  billboard,
  billboardLoading,
}: DashboardProps) {
  return (
    <div id="overview" className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div id="listening-stats" className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {topTracks[0] && <TopTrackCard track={topTracks[0]} />}
        <div className="relative md:col-span-1">
          <div className="hide-scrollbar h-72 overflow-y-auto sm:h-[420px] md:absolute md:inset-0 md:h-auto">
            <TrackList tracks={topTracks.slice(1, 50)} />
          </div>
        </div>
        <div className="space-y-4 md:space-y-5">
          <PopularityBarChart tracks={topTracks.slice(0, 50)} />
          <GenrePieChart genres={genreCounts} />
        </div>
      </div>

      <div id="recent-plays" className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-zinc-800 sm:p-7">
        <h2 className="mb-1 text-base font-semibold text-white">Recent Play Count</h2>
        <p className="mb-5 text-xs text-zinc-500">Your most replayed tracks from the last 50 plays</p>
        <RecentPlayCount tracks={topTracks} playCounts={playCounts} />
      </div>

      <div id="listening-clock">
        <ListeningHeatmap plays={recentPlays} />
      </div>

      <div id="listening-marathons">
        <ListeningMarathons plays={recentPlays} />
      </div>

      <div id="artist-obsessions">
        <ArtistObsessionPhases plays={recentPlays} topArtists={topArtists} />
      </div>

      <div id="discovery-rate">
        <DiscoveryRateChart plays={recentPlays} />
      </div>

      <div id="billboard">
        <BillboardComparison
          billboard={billboard}
          billboardLoading={billboardLoading}
          topArtists={topArtists}
          topTracks={topTracks}
        />
      </div>
    </div>
  );
}
