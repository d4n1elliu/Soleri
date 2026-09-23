import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getToken, unauthorized, serverError } from './_lib/http.js';
import { verifySpotifyUser } from './_lib/spotify.js';
import { supabaseRest, storageDelete } from './_lib/supabase.js';
import {
  ACCENT_COLORS,
  PROFILE_LIMITS,
  PROFILE_IMAGE_BUCKET as BUCKET,
  type ProfileData,
  type ProfileLink,
  type PinnedTrack,
} from '../shared/types/profile.js';

// GET is public by spotifyId; PUT/DELETE act as the token's user, never a client-sent ID

interface ProfileRow {
  spotify_user_id: string;
  display_name: string | null;
  bio: string | null;
  pronouns: string | null;
  location: string | null;
  links: ProfileLink[];
  pinned_track: PinnedTrack | null;
  accent_color: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  show_genres: boolean;
  show_artists: boolean;
  show_tracks: boolean;
  updated_at: string;
}

function toPublic(row: ProfileRow): ProfileData {
  return {
    spotifyUserId: row.spotify_user_id,
    displayName: row.display_name,
    bio: row.bio,
    pronouns: row.pronouns,
    location: row.location,
    links: row.links ?? [],
    pinnedTrack: row.pinned_track,
    accentColor: row.accent_color,
    avatarUrl: row.avatar_url,
    bannerUrl: row.banner_url,
    showGenres: row.show_genres,
    showArtists: row.show_artists,
    showTracks: row.show_tracks,
  };
}

function cleanText(value: unknown, maxLength: number, allowNewlines = false): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') throw new Error('invalid text field');
  // eslint-disable-next-line no-control-regex
  let text = value.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '');
  if (!allowNewlines) text = text.replace(/[\r\n]+/g, ' ');
  text = text.trim();
  if (text.length > maxLength) throw new Error('text field too long');
  return text || null;
}

function cleanLinks(value: unknown): ProfileLink[] {
  if (value === null || value === undefined) return [];
  if (!Array.isArray(value) || value.length > PROFILE_LIMITS.links) throw new Error('invalid links');
  return value.map((raw) => {
    const link = raw as Record<string, unknown>;
    const url = typeof link.url === 'string' ? link.url.trim() : '';
    if (!url || url.length > PROFILE_LIMITS.linkUrl) throw new Error('invalid link url');
    const parsed = new URL(url); // throws on garbage
    if (parsed.protocol !== 'https:') throw new Error('links must be https');
    const label = cleanText(link.label, PROFILE_LIMITS.linkLabel) ?? parsed.hostname;
    return { label, url };
  });
}

function cleanPinnedTrack(value: unknown): PinnedTrack | null {
  if (value === null || value === undefined) return null;
  const track = value as Record<string, unknown>;
  const id = typeof track.id === 'string' ? track.id : '';
  const name = cleanText(track.name, PROFILE_LIMITS.trackText);
  const artists = cleanText(track.artists, PROFILE_LIMITS.trackText);
  const image = typeof track.image === 'string' ? track.image : '';
  if (!/^[A-Za-z0-9]{1,40}$/.test(id) || !name || !artists) throw new Error('invalid pinned track');
  if (image && (!image.startsWith('https://') || image.length > 300)) {
    throw new Error('invalid pinned track image');
  }
  return { id, name, artists, image };
}

function cleanAccent(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string' || !(ACCENT_COLORS as readonly string[]).includes(value)) {
    throw new Error('invalid accent colour');
  }
  return value;
}

// Best-effort per-instance limiter; the updated_at floor below covers cold starts
const recentWrites = new Map<string, number[]>();
function rateLimited(userId: string): boolean {
  const now = Date.now();
  const times = (recentWrites.get(userId) ?? []).filter((t) => now - t < 60_000);
  times.push(now);
  recentWrites.set(userId, times);
  return times.length > 10;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const spotifyId = typeof req.query.spotifyId === 'string' ? req.query.spotifyId : '';
      if (!spotifyId || spotifyId.length > 100) {
        return res.status(400).json({ error: 'Invalid spotifyId' });
      }
      const resp = await supabaseRest(
        `/profiles?spotify_user_id=eq.${encodeURIComponent(spotifyId)}&limit=1`,
      );
      if (!resp.ok) return serverError(res, 'fetch profile', await resp.text());
      const rows = (await resp.json()) as ProfileRow[];
      if (rows.length === 0) return res.status(404).json({ error: 'Profile not found' });
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
      return res.status(200).json({ profile: toPublic(rows[0]) });
    }

    const token = getToken(req);
    if (!token) return unauthorized(res);
    const userId = await verifySpotifyUser(token);
    if (!userId) return res.status(401).json({ error: 'Invalid Spotify token' });

    if (req.method === 'PUT') {
      if (rateLimited(userId)) {
        return res.status(429).json({ error: 'Too many updates, slow down' });
      }
      const body = (req.body ?? {}) as Record<string, unknown>;
      let row: Omit<ProfileRow, 'updated_at'> & { updated_at: string };
      try {
        row = {
          spotify_user_id: userId,
          display_name: cleanText(body.displayName, PROFILE_LIMITS.displayName),
          bio: cleanText(body.bio, PROFILE_LIMITS.bio, true),
          pronouns: cleanText(body.pronouns, PROFILE_LIMITS.pronouns),
          location: cleanText(body.location, PROFILE_LIMITS.location),
          links: cleanLinks(body.links),
          pinned_track: cleanPinnedTrack(body.pinnedTrack),
          accent_color: cleanAccent(body.accentColor),
          avatar_url: null, // set below; image URLs are server-owned
          banner_url: null,
          show_genres: body.showGenres !== false,
          show_artists: body.showArtists !== false,
          show_tracks: body.showTracks !== false,
          updated_at: new Date().toISOString(),
        };
      } catch (err) {
        return res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid profile' });
      }

      // Keep existing image URLs (only api/profile-image writes them); null clears
      const existingResp = await supabaseRest(
        `/profiles?spotify_user_id=eq.${encodeURIComponent(userId)}&select=avatar_url,banner_url,updated_at&limit=1`,
      );
      if (!existingResp.ok) return serverError(res, 'fetch profile', await existingResp.text());
      const existing = (await existingResp.json()) as ProfileRow[];
      if (existing.length > 0) {
        const age = Date.now() - new Date(existing[0].updated_at).getTime();
        if (age < 3000) return res.status(429).json({ error: 'Too many updates, slow down' });
        row.avatar_url = body.avatarUrl === null ? null : existing[0].avatar_url;
        row.banner_url = body.bannerUrl === null ? null : existing[0].banner_url;
        if (body.avatarUrl === null && existing[0].avatar_url) {
          await storageDelete(BUCKET, `avatars/${userId}`);
        }
        if (body.bannerUrl === null && existing[0].banner_url) {
          await storageDelete(BUCKET, `banners/${userId}`);
        }
      }

      const upsert = await supabaseRest('/profiles?on_conflict=spotify_user_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(row),
      });
      if (!upsert.ok) return serverError(res, 'save profile', await upsert.text());
      const saved = (await upsert.json()) as ProfileRow[];
      return res.status(200).json({ profile: toPublic(saved[0]) });
    }

    if (req.method === 'DELETE') {
      await storageDelete(BUCKET, `avatars/${userId}`);
      await storageDelete(BUCKET, `banners/${userId}`);
      const del = await supabaseRest(
        `/profiles?spotify_user_id=eq.${encodeURIComponent(userId)}`,
        { method: 'DELETE' },
      );
      if (!del.ok) return serverError(res, 'delete profile', await del.text());
      return res.status(200).json({ deleted: true });
    }

    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return serverError(res, 'handle profile', err);
  }
}
