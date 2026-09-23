import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getToken, unauthorized, serverError } from './_lib/http.js';
import { verifySpotifyUser } from './_lib/spotify.js';
import { supabaseRest, storageUpload, storagePublicUrl } from './_lib/supabase.js';
import { PROFILE_LIMITS, PROFILE_IMAGE_BUCKET as BUCKET } from '../shared/types/profile.js';

// One avatar/banner per user, overwritten in place; type sniffed from magic bytes

export const config = { api: { bodyParser: false } };

function sniffImageType(bytes: Buffer): string | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  return null;
}

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    if (chunks.reduce((n, c) => n + c.length, 0) > PROFILE_LIMITS.imageBytes + 1024) break;
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const kind = req.query.kind === 'banner' ? 'banner' : req.query.kind === 'avatar' ? 'avatar' : null;
    if (!kind) return res.status(400).json({ error: 'kind must be avatar or banner' });

    const token = getToken(req);
    if (!token) return unauthorized(res);
    const userId = await verifySpotifyUser(token);
    if (!userId) return res.status(401).json({ error: 'Invalid Spotify token' });

    const bytes = await readRawBody(req);
    if (bytes.length === 0) return res.status(400).json({ error: 'Empty upload' });
    if (bytes.length > PROFILE_LIMITS.imageBytes) {
      return res.status(413).json({ error: 'Image must be under 2 MB' });
    }
    const contentType = sniffImageType(bytes);
    if (!contentType) {
      return res.status(415).json({ error: 'Only JPEG, PNG or WebP images are allowed' });
    }

    const path = `${kind}s/${userId}`;
    const upload = await storageUpload(BUCKET, path, bytes, contentType);
    if (!upload.ok) return serverError(res, 'upload image', await upload.text());

    // Versioned URL cache-busts the overwrite
    const url = `${storagePublicUrl(BUCKET, path)}?v=${Date.now()}`;
    const column = kind === 'avatar' ? 'avatar_url' : 'banner_url';
    const update = await supabaseRest('/profiles?on_conflict=spotify_user_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        spotify_user_id: userId,
        [column]: url,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!update.ok) return serverError(res, 'save image url', await update.text());

    return res.status(200).json({ url });
  } catch (err) {
    return serverError(res, 'handle profile image', err);
  }
}
