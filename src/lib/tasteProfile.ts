import type { SpotifyTopArtist, SpotifyTrack } from '../types';

// Compact taste payload encoded into the QR / share URL
export interface TastePayload {
  id: string;   // Spotify user ID
  n: string;    // display name (max 20 chars)
  a: string[];  // top 8 artist IDs
  g: string[];  // top 5 genre strings
  t: string[];  // top 4 track IDs
  an?: string[]; // artist names, parallel to `a` (absent in legacy)
  tn?: string[]; // track names, parallel to `t` (absent in legacy)
}

export interface TasteEntry {
  id: string;
  name: string;
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

export function encodePayload(payload: TastePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

// Distinguishes api/share IDs from long base64url legacy tokens
export function isShareId(token: string): boolean {
  return /^[A-Za-z0-9]{6,12}$/.test(token);
}

export function buildTastePayload(
  spotifyId: string,
  displayName: string,
  topArtists: SpotifyTopArtist[],
  topTracks: SpotifyTrack[],
  genreCounts: { genre: string; count: number }[],
): TastePayload {
  const artists = topArtists.slice(0, 8);
  const tracks = topTracks.slice(0, 4);
  return {
    id: spotifyId,
    n: displayName.slice(0, 20),
    a: artists.map((a) => a.id),
    g: genreCounts.slice(0, 5).map((g) => g.genre),
    t: tracks.map((t) => t.id),
    an: artists.map((a) => a.name.slice(0, 30)),
    tn: tracks.map((t) => t.name.slice(0, 30)),
  };
}

export function encodeTasteProfile(
  spotifyId: string,
  displayName: string,
  topArtists: SpotifyTopArtist[],
  topTracks: SpotifyTrack[],
  genreCounts: { genre: string; count: number }[],
): string {
  return encodePayload(
    buildTastePayload(spotifyId, displayName, topArtists, topTracks, genreCounts),
  );
}

// Share URLs: <origin>/u/<token>
export function buildShareUrl(origin: string, encoded: string): string {
  return `${origin}/u/${encoded}`;
}

export function extractSharePayload(url: string): string | null {
  const match = url.match(/\/u\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

function zipEntries(ids: string[], names?: string[]): TasteEntry[] {
  return (names ?? [])
    .map((name, i) => ({ id: ids[i], name }))
    .filter((e) => e.id && e.name);
}

export function payloadArtists(payload: TastePayload): TasteEntry[] {
  return zipEntries(payload.a, payload.an);
}

export function payloadTracks(payload: TastePayload): TasteEntry[] {
  return zipEntries(payload.t, payload.tn);
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
