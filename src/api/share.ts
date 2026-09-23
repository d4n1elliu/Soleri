import type { TastePayload } from '../lib/tasteProfile';

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
