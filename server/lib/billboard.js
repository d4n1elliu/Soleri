// Returns only the primary artist, dropping any "feat." artist credits
function primaryArtist(rawArtist) {
  return rawArtist
    .split(/\s+(?:featuring|feat\.?|ft\.?|&|\+|x|with)\s+/i)[0]
    .trim();
}

// Converts HTML entities like &amp; back to normal characters
function htmlDecode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

// Removes the Billboard Hot 100 page and returns a list of artist names.
// Billboard has no public API so we parse the raw HTML instead.
async function fetchHot100Artists() {
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

    // Each chart entry is separated by this class name in the HTML
    const rows = html.split('o-chart-results-list-row-container');
    const seen = new Set();
    const names = [];

    for (const row of rows) {
      const m = row.match(/<span[^>]*c-label[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
      if (!m) continue;
      const raw = htmlDecode(m[1].trim());
      const primary = primaryArtist(raw);
      const key = primary.toLowerCase();
      // Remove duplicates artists so the same artist can appear multiple times on the chart
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

module.exports = { fetchHot100Artists };
