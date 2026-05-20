export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  name: string;
  images: { url: string; width: number; height: number }[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  popularity: number;
  duration_ms: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: { spotify: string };
}

/** A fully-detailed artist as returned by /me/top/artists. */
export interface SpotifyTopArtist extends SpotifyArtist {
  genres: string[];
  popularity: number;
  followers: { total: number };
  images: { url: string; width: number; height: number }[];
  external_urls: { spotify: string };
}

/** A single entry from /me/player/recently-played. */
export interface RecentPlay {
  played_at: string;
  track: SpotifyTrack;
}

/** A Billboard chart artist resolved against the Spotify catalogue. */
export interface BillboardArtist {
  name: string;
  popularity: number;
  followers: number;
  genres: string[];
  image: string | null;
}

/** Aggregated Billboard benchmark data returned by /api/billboard. */
export interface BillboardData {
  artists: BillboardArtist[];
  averagePopularity: number;
  averageFollowers: number;
  genres: { genre: string; count: number }[];
}
