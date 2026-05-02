import { useState, useEffect } from 'react';
import type { SpotifyTrack } from '../types/spotify';
import { exchangeCodeForToken, fetchTopTracks, fetchRecentlyPlayed, fetchGenreCounts } from '../api/spotify';

interface GenreEntry { genre: string; count: number }

interface SpotifyAuthState {
  isLoggedIn: boolean;
  topTracks: SpotifyTrack[];
  playCounts: Record<string, number>;
  genreCounts: GenreEntry[];
  isLoading: boolean;
}

export function useSpotifyAuth(): SpotifyAuthState {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
  const [genreCounts, setGenreCounts] = useState<GenreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    setIsLoading(true);
    exchangeCodeForToken(code)
      .then((token) => {
        if (!token) return;
        setIsLoggedIn(true);
        return Promise.all([fetchTopTracks(token), fetchRecentlyPlayed(token), fetchGenreCounts(token)]);
      })
      .then((results) => {
        if (!results) return;
        const [tracks, counts, genres] = results;
        setTopTracks(tracks);
        setPlayCounts(counts);
        setGenreCounts(genres);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { isLoggedIn, topTracks, playCounts, genreCounts, isLoading };
}
