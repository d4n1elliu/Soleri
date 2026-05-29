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

// Lays out all the dashboard sections in order: top tracks, charts, then insights
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
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        {topTracks[0] && <TopTrackCard track={topTracks[0]} />}
        <div className="relative md:col-span-1">
          <div className="hide-scrollbar h-[420px] overflow-y-auto md:absolute md:inset-0 md:h-auto">
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

      <ListeningMarathons plays={recentPlays} />

      <ArtistObsessionPhases plays={recentPlays} topArtists={topArtists} />

      <DiscoveryRateChart plays={recentPlays} />

      <BillboardComparison
        billboard={billboard}
        billboardLoading={billboardLoading}
        topArtists={topArtists}
        topTracks={topTracks}
      />
    </div>
  );
}
