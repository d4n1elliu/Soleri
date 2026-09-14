import type {
  SpotifyTrack,
  SpotifyTopArtist,
  RecentPlay,
  BillboardData,
  TimeRange,
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
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  topsLoading: boolean;
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'short_term', label: 'Last 4 weeks' },
  { value: 'medium_term', label: 'Last 6 months' },
  { value: 'long_term', label: 'All time' },
];

export function Dashboard({
  topTracks,
  topArtists,
  recentPlays,
  playCounts,
  genreCounts,
  billboard,
  billboardLoading,
  timeRange,
  onTimeRangeChange,
  topsLoading,
}: DashboardProps) {
  return (
    <div id="overview" className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      {/* Time range filter for the Spotify top-stats windows */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          Showing your top tracks, artists and genres for{' '}
          <span className="font-medium text-zinc-300">
            {TIME_RANGE_OPTIONS.find((o) => o.value === timeRange)?.label.toLowerCase()}
          </span>
        </p>
        <div className="flex w-fit rounded-full bg-zinc-900 p-1 ring-1 ring-zinc-800">
          {TIME_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value)}
              disabled={topsLoading}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                option.value === timeRange
                  ? 'bg-green-500 text-black'
                  : 'text-zinc-400 hover:text-white'
              } ${topsLoading ? 'cursor-wait' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id="listening-stats"
        className={`grid grid-cols-1 gap-4 transition-opacity md:grid-cols-3 md:gap-5 ${topsLoading ? 'opacity-50' : ''}`}
      >
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

      <div id="recent-plays" className="scroll-mt-20 rounded-2xl bg-zinc-900 p-5 ring-1 ring-zinc-800 sm:p-7">
        <h2 className="mb-1 text-base font-semibold text-white">Recent Play Count</h2>
        <p className="mb-5 text-xs text-zinc-500">Your most replayed tracks from the last 50 plays</p>
        <RecentPlayCount tracks={topTracks} playCounts={playCounts} />
      </div>

      <div id="listening-clock" className="scroll-mt-20">
        <ListeningHeatmap plays={recentPlays} />
      </div>

      <div id="listening-marathons" className="scroll-mt-20">
        <ListeningMarathons plays={recentPlays} />
      </div>

      <div id="artist-obsessions" className="scroll-mt-20">
        <ArtistObsessionPhases plays={recentPlays} topArtists={topArtists} />
      </div>

      <div id="discovery-rate" className="scroll-mt-20">
        <DiscoveryRateChart plays={recentPlays} />
      </div>

      <div id="billboard" className="scroll-mt-20">
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
