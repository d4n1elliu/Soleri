import type { TastePayload } from '../lib/tasteProfile';

interface CachedShare {
  hash: string;
  shareId: string;
}

const memoryCache = new Map<string, CachedShare>();

function payloadHash(payload: TastePayload): string {
  const str = JSON.stringify(payload);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

function cacheKey(spotifyId: string): string {
  return `soleri-share-${spotifyId}`;
}

function readCache(spotifyId: string): CachedShare | null {
  const inMemory = memoryCache.get(spotifyId);
  if (inMemory) return inMemory;
  try {
    const raw = localStorage.getItem(cacheKey(spotifyId));
    return raw ? (JSON.parse(raw) as CachedShare) : null;
  } catch {
    return null;
  }
}

function writeCache(spotifyId: string, entry: CachedShare) {
  memoryCache.set(spotifyId, entry);
  try {
    localStorage.setItem(cacheKey(spotifyId), JSON.stringify(entry));
  } catch {
    // Private mode; memory cache still applies
  }
}

// Reuses the cached ID while the payload is unchanged
export async function getOrCreateShare(payload: TastePayload): Promise<string | null> {
  const hash = payloadHash(payload);
  const cached = readCache(payload.id);
  if (cached && cached.hash === hash) return cached.shareId;

  const shareId = await createShare(payload);
  if (shareId) writeCache(payload.id, { hash, shareId });
  return shareId;
}

export async function createShare(payload: TastePayload): Promise<string | null> {
  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return data.id ?? null;
  } catch {
    return null;
  }
}

export async function fetchShare(id: string): Promise<TastePayload | null> {
  try {
    const res = await fetch(`/api/share?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { payload?: TastePayload };
    return data.payload ?? null;
  } catch {
    return null;
  }
}
