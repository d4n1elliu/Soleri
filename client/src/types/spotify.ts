// An artist's id and name, used inside their song tracks
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
  popularity: number;   // Spotify's 0–100 popularity score
  duration_ms: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: { spotify: string };
}

// A full artist, with genres, followers and more
export interface SpotifyTopArtist extends SpotifyArtist {
  genres: string[];
  popularity: number;
  followers: { total: number };
  images: { url: string; width: number; height: number }[];
  external_urls: { spotify: string };
}

// A track plus when it was played
export interface RecentPlay {
  played_at: string;
  track: SpotifyTrack;
}

// A Billboard Hot 100 artist matched to Spotify data
export interface BillboardArtist {
  name: string;
  popularity: number;
  followers: number;
  genres: string[];
  image: string | null;
  url: string;
}

// The response from our /api/billboard endpoint
export interface BillboardData {
  artists: BillboardArtist[];
  averagePopularity: number;
  averageFollowers: number;
  genres: { genre: string; count: number }[];
}
