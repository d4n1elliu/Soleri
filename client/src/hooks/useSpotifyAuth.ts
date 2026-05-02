import { useState, useEffect } from 'react';
import type { SpotifyTrack } from '../types/spotify';
import { exchangeCodeForToken, fetchTopTracks } from '../api/spotify';

interface SpotifyAuthState {
  isLoggedIn: boolean;
  topTracks: SpotifyTrack[];
  isLoading: boolean;
}

export function useSpotifyAuth(): SpotifyAuthState {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    setIsLoading(true);
    exchangeCodeForToken(code)
      .then((token) => {
        if (!token) return;
        setIsLoggedIn(true);
        return fetchTopTracks(token);
      })
      .then((tracks) => {
        if (tracks) setTopTracks(tracks);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { isLoggedIn, topTracks, isLoading };
}
