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

export interface SpotifyTopArtist extends SpotifyArtist {
  genres: string[];
  popularity: number;
  followers: { total: number };
  images: { url: string; width: number; height: number }[];
  external_urls: { spotify: string };
}

export interface RecentPlay {
  played_at: string;
  track: SpotifyTrack;
}

export interface BillboardArtist {
  name: string;
  popularity: number;
  followers: number;
  genres: string[];
  image: string | null;
  url: string;
}

export interface BillboardData {
  artists: BillboardArtist[];
  averagePopularity: number;
  averageFollowers: number;
  genres: { genre: string; count: number }[];
}
