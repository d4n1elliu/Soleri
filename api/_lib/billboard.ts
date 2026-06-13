function primaryArtist(rawArtist: string): string {
  return rawArtist
    .split(/\s+(?:featuring|feat\.?|ft\.?|&|\+|x|with)\s+/i)[0]
    .trim();
}

function htmlDecode(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

export async function fetchHot100Artists(): Promise<string[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch('https://www.billboard.com/charts/hot-100/', {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'text/html',
      },
    });
    if (!res.ok) throw new Error(`Billboard responded ${res.status}`);

    const html = await res.text();
    const rows = html.split('o-chart-results-list-row-container');
    const seen = new Set<string>();
    const names: string[] = [];

    for (const row of rows) {
      const m = row.match(/<span[^>]*c-label[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
      if (!m) continue;
      const raw = htmlDecode(m[1].trim());
      const primary = primaryArtist(raw);
      const key = primary.toLowerCase();
      if (primary && !seen.has(key)) {
        seen.add(key);
        names.push(primary);
      }
    }

    if (!names.length) throw new Error('No artists parsed from Billboard page');
    return names;
  } finally {
    clearTimeout(timeout);
  }
}

export interface BillboardArtistResult {
  name: string;
  popularity: number;
  followers: number;
  genres: string[];
  image: string | null;
  url: string;
}

export async function lookupArtist(
  name: string,
  token: string,
): Promise<BillboardArtistResult | null> {
  const url =
    'https://api.spotify.com/v1/search?' +
    new URLSearchParams({ q: name, type: 'artist', limit: '1' });

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;

  const data = await response.json() as { artists?: { items?: Array<{
    name: string;
    popularity: number;
    followers: { total: number };
    genres: string[];
    images: { url: string }[];
    external_urls: { spotify: string };
    id: string;
  }> } };
  const artist = data.artists?.items?.[0];
  if (!artist || !artist.images?.length) return null;

  return {
    name: artist.name,
    popularity: artist.popularity ?? 0,
    followers: artist.followers?.total ?? 0,
    genres: artist.genres ?? [],
    image: artist.images[artist.images.length - 1].url,
    url: artist.external_urls?.spotify ?? `https://open.spotify.com/artist/${artist.id}`,
  };
}
