import type { BillboardArtist, SpotifyTopArtist, SpotifyTrack } from '../types';

function billboardNameSet(artists: BillboardArtist[]): Set<string> {
  return new Set(artists.map((a) => a.name.toLowerCase()));
}

export interface ComparisonRow {
  rank: number;
  userArtist: SpotifyTopArtist | null;
  billboardArtist: BillboardArtist | null;
  userIsOnBillboard: boolean;
  billboardIsInUserTop: boolean;
}

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

export function computeUserAvgPopularity(tracks: SpotifyTrack[]): number {
  if (tracks.length === 0) return 0;
  return Math.round(tracks.reduce((s, t) => s + t.popularity, 0) / tracks.length);
}

export function countArtistOverlap(
  topArtists: SpotifyTopArtist[],
  billboardArtists: BillboardArtist[],
): number {
  const names = billboardNameSet(billboardArtists);
  return topArtists.filter((a) => names.has(a.name.toLowerCase())).length;
}
