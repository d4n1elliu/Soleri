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
