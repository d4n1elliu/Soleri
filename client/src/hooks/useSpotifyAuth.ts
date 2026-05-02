import { useState, useEffect } from 'react';
import type { SpotifyTrack } from '../types/spotify';
import { exchangeCodeForToken, fetchTopTracks, fetchRecentlyPlayed } from '../api/spotify';

interface SpotifyAuthState {
  isLoggedIn: boolean;
  topTracks: SpotifyTrack[];
  playCounts: Record<string, number>;
  isLoading: boolean;
}

export function useSpotifyAuth(): SpotifyAuthState {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    setIsLoading(true);
    exchangeCodeForToken(code)
      .then((token) => {
        if (!token) return;
        setIsLoggedIn(true);
        return Promise.all([fetchTopTracks(token), fetchRecentlyPlayed(token)]);
      })
      .then((results) => {
        if (!results) return;
        const [tracks, counts] = results;
        setTopTracks(tracks);
        setPlayCounts(counts);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { isLoggedIn, topTracks, playCounts, isLoading };
}
