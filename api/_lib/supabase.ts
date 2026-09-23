function config(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured');
  return { url, key };
}

export function supabaseRest(path: string, init: RequestInit = {}): Promise<Response> {
  const { url, key } = config();
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

export function storageUpload(
  bucket: string,
  path: string,
  body: Buffer,
  contentType: string,
): Promise<Response> {
  const { url, key } = config();
  return fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: new Uint8Array(body),
  });
}

export function storageDelete(bucket: string, path: string): Promise<Response> {
  const { url, key } = config();
  return fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'DELETE',
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
}

export function storagePublicUrl(bucket: string, path: string): string {
  const { url } = config();
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}
