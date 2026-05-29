import { useState, useEffect } from 'react';
import type {
  SpotifyTrack,
  SpotifyTopArtist,
  RecentPlay,
  BillboardData,
} from '../types';
import {
  exchangeCodeForToken,
  fetchTopTracks,
  fetchTopArtists,
  fetchRecentPlays,
  fetchBillboard,
  fetchUserProfile,
  computePlayCounts,
  computeGenreCounts,
} from '../api';

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
}

export function useSpotifyAuth(): SpotifyAuthState {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyTopArtist[]>([]);
  const [recentPlays, setRecentPlays] = useState<RecentPlay[]>([]);
  const [billboard, setBillboard] = useState<BillboardData | null>(null);
  const [billboardLoading, setBillboardLoading] = useState(false);
  // Share button stays hidden until this comes back, otherwise display null on load
  const [spotifyId, setSpotifyId] = useState<string | null>(null);

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

        // The Billboard comparison resolves dozens of catalogue lookups, so it
        // loads independently and never blocks the rest of the dashboard.
        fetchBillboard(token)
          .then(setBillboard)
          .catch(() => setBillboard(null))
          .finally(() => setBillboardLoading(false));

        // This run separately so it doesn't hold up the main dashboard fetch
        fetchUserProfile(token).then((profile) => {
          if (profile) setSpotifyId(profile.id);
        });

        return Promise.all([
          fetchTopTracks(token),
          fetchTopArtists(token),
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
  };
}
