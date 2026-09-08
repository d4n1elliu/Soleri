import { useState, useEffect, useRef } from 'react';
import type {
  SpotifyTrack,
  SpotifyTopArtist,
  RecentPlay,
  BillboardData,
  TimeRange,
} from '../types';
import {
  exchangeCodeForToken,
  fetchTopTracks,
  fetchTopArtists,
  fetchRecentPlays,
  fetchBillboard,
  fetchUserProfile,
} from '../api';
import { computePlayCounts, computeGenreCounts } from '../lib';

interface GenreEntry {
  genre: string;
  count: number;
}

interface SpotifyAuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyTopArtist[];
  recentPlays: RecentPlay[];
  playCounts: Record<string, number>;
  genreCounts: GenreEntry[];
  billboard: BillboardData | null;
  billboardLoading: boolean;
  spotifyId: string | null;
  displayName: string | null;
  token: string | null;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  topsLoading: boolean;
}

const DEFAULT_TIME_RANGE: TimeRange = 'medium_term';

export function useSpotifyAuth(): SpotifyAuthState {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyTopArtist[]>([]);
  const [recentPlays, setRecentPlays] = useState<RecentPlay[]>([]);
  const [billboard, setBillboard] = useState<BillboardData | null>(null);
  const [billboardLoading, setBillboardLoading] = useState(false);
  const [spotifyId, setSpotifyId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(DEFAULT_TIME_RANGE);
  const [topsLoading, setTopsLoading] = useState(false);
  // The initial load fetches tops itself; this skips the range effect's first run
  const rangeFetchArmed = useRef(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    setIsLoading(true);
    setBillboardLoading(true);

    exchangeCodeForToken(code)
      .then((token) => {
        if (!token) {
          setIsLoading(false);
          setBillboardLoading(false);
          return;
        }
        setIsLoggedIn(true);
        setToken(token);

        // Billboard takes longer (lots of lookups), so it loads separately
        // and never blocks the rest of the dashboard from appearing
        fetchBillboard(token)
          .then(setBillboard)
          .catch(() => setBillboard(null))
          .finally(() => setBillboardLoading(false));

        // Run separately so it doesn't hold up the main dashboard fetch
        fetchUserProfile(token).then((profile) => {
          if (profile) {
            setSpotifyId(profile.id);
            setDisplayName(profile.display_name);
          }
        });

        // Fetch the main dashboard data all at once
        return Promise.all([
          fetchTopTracks(token, DEFAULT_TIME_RANGE),
          fetchTopArtists(token, DEFAULT_TIME_RANGE),
          fetchRecentPlays(token),
        ])
          .then(([tracks, artists, plays]) => {
            setTopTracks(tracks);
            setTopArtists(artists);
            setRecentPlays(plays);
          })
          .finally(() => setIsLoading(false));
      })
      .catch(() => {
        setIsLoading(false);
        setBillboardLoading(false);
      });
  }, []);

  // Refetch top tracks/artists when the user picks a different time range
  useEffect(() => {
    if (!token) return;
    if (!rangeFetchArmed.current) {
      rangeFetchArmed.current = true;
      return;
    }

    let stale = false;
    setTopsLoading(true);
    Promise.all([fetchTopTracks(token, timeRange), fetchTopArtists(token, timeRange)])
      .then(([tracks, artists]) => {
        if (stale) return;
        setTopTracks(tracks);
        setTopArtists(artists);
      })
      .finally(() => {
        if (!stale) setTopsLoading(false);
      });

    return () => {
      stale = true;
    };
  }, [token, timeRange]);

  const playCounts = computePlayCounts(recentPlays);
  const genreCounts = computeGenreCounts(topArtists);

  return {
    isLoggedIn,
    isLoading,
    topTracks,
    topArtists,
    recentPlays,
    playCounts,
    genreCounts,
    billboard,
    billboardLoading,
    spotifyId,
    displayName,
    token,
    timeRange,
    setTimeRange,
    topsLoading,
  };
}
