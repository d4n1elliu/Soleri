import type { SpotifyTopArtist, SpotifyTrack } from '../types';

// Compact taste payload encoded into the QR URL
export interface TastePayload {
  n: string;    // display name (max 20 chars)
  a: string[];  // top 10 artist IDs
  g: string[];  // top 5 genre strings
  t: string[];  // top 5 track IDs
}

export interface TasteMatchResult {
  themName: string;
  sharedArtists: SpotifyTopArtist[];
  sharedGenres: string[];
  genreOverlapPct: number;
  compatibilityScore: number;
  sharedTopTrack: SpotifyTrack | null;
}

// UTF-8 safe base64url encode
function toBase64Url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// UTF-8 safe base64url decode
function fromBase64Url(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const padded2 = pad ? padded + '='.repeat(4 - pad) : padded;
  return decodeURIComponent(escape(atob(padded2)));
}

export function encodeTasteProfile(
  displayName: string,
  topArtists: SpotifyTopArtist[],
  topTracks: SpotifyTrack[],
  genreCounts: { genre: string; count: number }[],
): string {
  const payload: TastePayload = {
    n: displayName.slice(0, 20),
    a: topArtists.slice(0, 10).map((a) => a.id),
    g: genreCounts.slice(0, 5).map((g) => g.genre),
    t: topTracks.slice(0, 5).map((t) => t.id),
  };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeTasteProfile(encoded: string): TastePayload | null {
  try {
    return JSON.parse(fromBase64Url(encoded)) as TastePayload;
  } catch {
    return null;
  }
}

export function computeTasteMatch(
  them: TastePayload,
  myTopArtists: SpotifyTopArtist[],
  myTopTracks: SpotifyTrack[],
  myGenreCounts: { genre: string; count: number }[],
): TasteMatchResult {
  const theirArtistIds = new Set(them.a);
  const theirGenres = new Set(them.g);
  const theirTrackIds = new Set(them.t);

  const sharedArtists = myTopArtists.filter((a) => theirArtistIds.has(a.id));

  const myGenreSet = new Set(myGenreCounts.map((g) => g.genre));
  const sharedGenres = [...myGenreSet].filter((g) => theirGenres.has(g));
  const allGenres = new Set([...myGenreSet, ...theirGenres]);
  const genreOverlapPct =
    allGenres.size > 0 ? Math.round((sharedGenres.length / allGenres.size) * 100) : 0;

  // 50 pts from artists (5+ shared = max), 50 pts from genre overlap
  const artistScore = Math.min(sharedArtists.length * 10, 50);
  const genreScore = Math.round(genreOverlapPct / 2);
  const compatibilityScore = artistScore + genreScore;

  const sharedTopTrack = myTopTracks.find((t) => theirTrackIds.has(t.id)) ?? null;

  return {
    themName: them.n,
    sharedArtists: sharedArtists.slice(0, 5),
    sharedGenres: sharedGenres.slice(0, 6),
    genreOverlapPct,
    compatibilityScore,
    sharedTopTrack,
  };
}

export function compatibilityLabel(score: number): string {
  if (score >= 80) return 'Music Soulmates';
  if (score >= 60) return 'Great Match';
  if (score >= 40) return 'Good Vibes';
  if (score >= 20) return 'Some Overlap';
  return 'Different Worlds';
}
