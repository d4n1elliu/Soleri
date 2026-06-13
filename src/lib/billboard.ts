import type { BillboardArtist, SpotifyTopArtist, SpotifyTrack } from '../types';

// Lowercase set of Billboard artist names, used for fast lookups
function billboardNameSet(artists: BillboardArtist[]): Set<string> {
  return new Set(artists.map((a) => a.name.toLowerCase()));
}

// One row in the side-by-side comparison table
export interface ComparisonRow {
  rank: number;
  userArtist: SpotifyTopArtist | null;
  billboardArtist: BillboardArtist | null;
  userIsOnBillboard: boolean;   // the user's artist also appears on Billboard
  billboardIsInUserTop: boolean; // the Billboard artist is also in the user's top list
}

// Zips the user's top artists against the Billboard list side by side (rank vs rank)
export function buildComparisonRows(
  topArtists: SpotifyTopArtist[],
  billboardArtists: BillboardArtist[],
  limit = 50,
): ComparisonRow[] {
  const billboardNames = billboardNameSet(billboardArtists);
  const userNameSet = new Set(topArtists.map((a) => a.name.toLowerCase()));
  const count = Math.min(limit, Math.max(topArtists.length, billboardArtists.length));

  return Array.from({ length: count }, (_, i) => {
    const userArtist = topArtists[i] ?? null;
    const billboardArtist = billboardArtists[i] ?? null;
    return {
      rank: i + 1,
      userArtist,
      billboardArtist,
      userIsOnBillboard: userArtist !== null && billboardNames.has(userArtist.name.toLowerCase()),
      billboardIsInUserTop:
        billboardArtist !== null && userNameSet.has(billboardArtist.name.toLowerCase()),
    };
  });
}

// Average Spotify popularity score (0-100) across the user's top tracks
export function computeUserAvgPopularity(tracks: SpotifyTrack[]): number {
  if (tracks.length === 0) return 0;
  return Math.round(tracks.reduce((s, t) => s + t.popularity, 0) / tracks.length);
}

// How many of the user's top artists also appear on the Billboard chart
export function countArtistOverlap(
  topArtists: SpotifyTopArtist[],
  billboardArtists: BillboardArtist[],
): number {
  const names = billboardNameSet(billboardArtists);
  return topArtists.filter((a) => names.has(a.name.toLowerCase())).length;
}
