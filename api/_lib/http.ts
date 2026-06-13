import type { VercelRequest, VercelResponse } from '@vercel/node';

export function getToken(req: VercelRequest): string | null {
  return req.headers.authorization?.split(' ')[1] ?? null;
}

export function unauthorized(res: VercelResponse) {
  return res.status(401).json({ error: 'Missing access token' });
}

export function serverError(res: VercelResponse, label: string, err: unknown) {
  console.error(`${label} error:`, err instanceof Error ? err.message : err);
  return res.status(500).json({ error: `Failed to ${label}` });
}
