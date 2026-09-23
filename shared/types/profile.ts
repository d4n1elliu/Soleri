export interface ProfileLink {
  label: string;
  url: string;
}

export interface PinnedTrack {
  id: string;
  name: string;
  artists: string;
  image: string;
}

export interface ProfileData {
  spotifyUserId: string;
  displayName: string | null;
  bio: string | null;
  pronouns: string | null;
  location: string | null;
  links: ProfileLink[];
  pinnedTrack: PinnedTrack | null;
  accentColor: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  showGenres: boolean;
  showArtists: boolean;
  showTracks: boolean;
}

export const ACCENT_COLORS = [
  '#22c55e', // green (default)
  '#10b981', // emerald
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
] as const;

export const PROFILE_IMAGE_BUCKET = 'profile-images';

export const PROFILE_LIMITS = {
  displayName: 40,
  bio: 160,
  pronouns: 20,
  location: 40,
  links: 3,
  linkLabel: 30,
  linkUrl: 200,
  trackText: 100,
  imageBytes: 2 * 1024 * 1024,
} as const;
