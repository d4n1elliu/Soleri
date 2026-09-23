import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'node:crypto';
import { serverError } from './_lib/http.js';

// POST stores a taste payload under a short ID; GET ?id= returns it. Supabase-backed.

const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ID_LENGTH = 8;
const MAX_PAYLOAD_BYTES = 4096;

interface SharePayload {
  id: string;
  n: string;
  a: string[];
  g: string[];
  t: string[];
  an?: string[];
  tn?: string[];
}

function generateId(): string {
  const bytes = randomBytes(ID_LENGTH);
  let id = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    id += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  }
  return id;
}

function isStringArray(value: unknown, maxItems: number, maxLength: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every((item) => typeof item === 'string' && item.length <= maxLength)
  );
}

function validatePayload(body: unknown): SharePayload | null {
  if (!body || typeof body !== 'object') return null;
  if (JSON.stringify(body).length > MAX_PAYLOAD_BYTES) return null;
  const p = body as Record<string, unknown>;
  if (typeof p.id !== 'string' || !p.id || p.id.length > 100) return null;
  if (typeof p.n !== 'string' || !p.n || p.n.length > 30) return null;
  if (!isStringArray(p.a, 10, 40) || !isStringArray(p.g, 8, 60) || !isStringArray(p.t, 10, 40)) {
    return null;
  }
  const an = p.an === undefined ? undefined : isStringArray(p.an, 10, 60) ? p.an : null;
  const tn = p.tn === undefined ? undefined : isStringArray(p.tn, 10, 60) ? p.tn : null;
  if (an === null || tn === null) return null;
  return { id: p.id, n: p.n, a: p.a, g: p.g, t: p.t, an, tn };
}

function supabase(path: string, init: RequestInit = {}): Promise<Response> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured');
  return fetch(`${url}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const id = typeof req.query.id === 'string' ? req.query.id : '';
      if (!/^[A-Za-z0-9]{6,12}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid share ID' });
      }
      const resp = await supabase(`/shares?id=eq.${id}&select=payload`);
      if (!resp.ok) return serverError(res, 'fetch share', await resp.text());
      const rows = (await resp.json()) as { payload: SharePayload }[];
      if (rows.length === 0) return res.status(404).json({ error: 'Share not found' });
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=86400');
      return res.status(200).json({ payload: rows[0].payload });
    }

    if (req.method === 'POST') {
      const payload = validatePayload(req.body);
      if (!payload) return res.status(400).json({ error: 'Invalid share payload' });

      // PostgREST returns 409 on ID collision
      for (let attempt = 0; attempt < 3; attempt++) {
        const id = generateId();
        const resp = await supabase('/shares', {
          method: 'POST',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({ id, payload }),
        });
        if (resp.ok) return res.status(201).json({ id });
        if (resp.status !== 409) return serverError(res, 'create share', await resp.text());
      }
      return serverError(res, 'create share', 'ID collision retries exhausted');
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return serverError(res, 'handle share', err);
  }
}
