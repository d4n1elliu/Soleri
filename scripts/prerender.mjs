// Post-build prerenderer for public routes.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle):
// renders each PUBLIC route to static HTML, injects per-route metadata,
// and emits robots.txt + sitemap.xml from the same route list.
//
// No Spotify API calls happen here: rendering the landing/legal pages
// only executes React components; data fetching lives in useEffect,
// which never runs during renderToString.

import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_ROUTES, resolveSiteUrl } from './routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const serverDir = path.join(distDir, 'server');

const SITE_URL = resolveSiteUrl();
const OG_IMAGE = `${SITE_URL}/og.png`;

const { render } = await import(
  new URL(path.join(serverDir, 'entry-server.js'), 'file://').href
);

const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('dist/index.html is missing the prerender placeholders');
}

function escapeAttr(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function buildHead(route) {
  const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
  const description = escapeAttr(route.description);
  const title = escapeAttr(route.title);

  const tags = [
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Soleri" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ];
  if (route.jsonLd) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>`,
    );
  }
  return tags.join('\n    ');
}

for (const route of PUBLIC_ROUTES) {
  const appHtml = render(route.path);
  if (!appHtml || appHtml.length < 500) {
    throw new Error(`Prerender of ${route.path} produced suspiciously little HTML`);
  }

  const html = template
    .replace('<title>Soleri</title>', `<title>${escapeAttr(route.title)}</title>`)
    .replace('<!--app-head-->', buildHead(route))
    .replace('<!--app-html-->', appHtml);

  const outPath = path.join(distDir, route.outFile);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  console.log(`[prerender] ${route.path} -> dist/${route.outFile} (${html.length} bytes)`);
}

// robots.txt: public routes crawlable; API and OAuth callback are not.
const robots = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /api/',
  'Disallow: /*?code=',
  '',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  '',
].join('\n');
await writeFile(path.join(distDir, 'robots.txt'), robots);
console.log('[prerender] wrote dist/robots.txt');

// sitemap.xml, generated from the same route list as the prerenderer.
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PUBLIC_ROUTES.map((route) =>
    [
      '  <url>',
      `    <loc>${SITE_URL}${route.path === '/' ? '/' : route.path}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
console.log('[prerender] wrote dist/sitemap.xml');

// The SSR bundle is build tooling, not a deployable asset.
await rm(serverDir, { recursive: true, force: true });
console.log('[prerender] removed dist/server');
