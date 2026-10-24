import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const templatePath = path.join(dist, 'index.html');
const START = '<!-- SEO-HEAD:START';
const END = '<!-- SEO-HEAD:END -->';

function decodeHtmlEntities(value) {
  return String(value)
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function safeRoutePath(route) {
  if (typeof route !== 'string' || !route.startsWith('/') || route.startsWith('//') || route.includes('..')) {
    throw new Error(`Unsafe route path in SEO data: ${String(route)}`);
  }
  return route;
}

function getHelmetHead(helmet) {
  if (!helmet) throw new Error('No react-helmet-async metadata was collected during prerendering.');
  const parts = [
    helmet.title?.toString(),
    helmet.meta?.toString(),
    helmet.link?.toString(),
    helmet.script?.toString(),
  ].filter(Boolean);
  return parts.join('\n    ');
}

function replaceHead(template, head) {
  const start = template.indexOf(START);
  const end = template.indexOf(END);
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('Could not find SEO-HEAD markers in index.html. Keep SEO-HEAD:START and SEO-HEAD:END in the template.');
  }
  const closeOfStartComment = template.indexOf('-->', start);
  if (closeOfStartComment < 0 || closeOfStartComment > end) throw new Error('Malformed SEO-HEAD:START comment.');
  return `${template.slice(0, start)}<!-- SEO-HEAD:START -->\n    ${head}\n    ${template.slice(end)}`;
}

function extractTag(html, regex, label, route) {
  const matches = [...html.matchAll(regex)];
  if (matches.length !== 1) throw new Error(`${route}: expected exactly one ${label}, found ${matches.length}.`);
  return matches[0][1];
}

function validatePrerenderedHtml(html, route, expectedUrl) {
  const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/gi, 'title', route);
  const description = extractTag(html, /<meta\s+[^>]*name="description"[^>]*content="([^"]*)"[^>]*\/?\s*>/gi, 'meta description', route);
  const canonicals = [...html.matchAll(/<link\s+[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*\/?\s*>/gi)];
  if (canonicals.length !== 1) throw new Error(`${route}: expected exactly one canonical link, found ${canonicals.length}.`);
  if (canonicals[0][1] !== expectedUrl) throw new Error(`${route}: canonical mismatch. Expected ${expectedUrl}, received ${canonicals[0][1]}.`);
  if (!title.replace(/<[^>]+>/g, '').trim()) throw new Error(`${route}: empty title.`);
  if (!description.trim()) throw new Error(`${route}: empty meta description.`);
  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  if (h1Count !== 1) console.warn(`[SEO audit] ${route}: expected one H1, found ${h1Count}.`);
  if (!/<meta\s+[^>]*name=["']robots["'][^>]*content=["']index, follow/i.test(html)) {
    throw new Error(`${route}: indexable route is missing an index,follow robots directive.`);
  }
  const ldScripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, raw] of ldScripts) {
    try { JSON.parse(raw); }
    catch (error) { throw new Error(`${route}: invalid JSON-LD: ${error.message}`); }
  }
  if (!html.includes('data-prerendered="true"')) throw new Error(`${route}: prerendered root marker missing.`);
  for (const [label, regex] of [
    ['Open Graph title', /<meta\s+[^>]*property=["']og:title["']/gi],
    ['Open Graph description', /<meta\s+[^>]*property=["']og:description["']/gi],
    ['Twitter title', /<meta\s+[^>]*name=["']twitter:title["']/gi],
    ['Twitter description', /<meta\s+[^>]*name=["']twitter:description["']/gi],
  ]) {
    const count = [...html.matchAll(regex)].length;
    if (count !== 1) throw new Error(`${route}: expected exactly one ${label}, found ${count}.`);
  }
  return { title: decodeHtmlEntities(title.replace(/<[^>]+>/g, '').trim()), description: decodeHtmlEntities(description.trim()) };
}

function auditInternalLinks(html, route, knownRoutes) {
  const problems = new Set();
  for (const [, href] of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/#')) continue;
    let pathname = href.split(/[?#]/, 1)[0];
    try { pathname = decodeURIComponent(pathname); } catch { /* retain literal path for the audit */ }
    if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '');
    if (/\.[a-z0-9]{2,8}$/i.test(pathname)) continue; // Static files, not page routes.
    if (!knownRoutes.has(pathname)) problems.add(pathname);
  }
  if (problems.size) console.warn(`[SEO audit] ${route}: internal links target paths not present in the route registry: ${[...problems].join(', ')}`);
}

const template = await fs.readFile(templatePath, 'utf8');
const server = await createServer({
  configFile: path.join(root, 'vite.config.js'),
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const requiredAssets = [
    'favicon.ico',
    'images/og-onlinedevelopertool.webp',
    'images/onlinedevelopertool-com-free-online-developer-tools.webp',
    'images/json-formatter-online-before-after.webp',
    'images/json-formatter-demo-poster.webp',
    'video/json-formatter-demo.mp4',
  ];
  for (const asset of requiredAssets) {
    try { await fs.access(path.join(root, 'public', asset)); }
    catch { throw new Error(`Required referenced public asset is missing: public/${asset}`); }
  }

  const [{ renderPage }, seo, app] = await Promise.all([
    server.ssrLoadModule('/src/entry-server.jsx'),
    server.ssrLoadModule('/src/data/seo.js'),
    server.ssrLoadModule('/src/App.jsx'),
  ]);
  const routes = seo.getIndexableRoutes().map(safeRoutePath);
  const routeSet = new Set(routes);
  if (routeSet.size !== routes.length) throw new Error('SEO route list contains duplicate paths.');
  const appPaths = new Set(app.routes.map((route) => route.path));
  const missingAppRoutes = routes.filter((route) => !appPaths.has(route));
  if (missingAppRoutes.length) throw new Error(`Routes in SEO data are missing from App.jsx: ${missingAppRoutes.join(', ')}`);

  let renderedCount = 0;
  const seenTitles = new Map();
  const seenDescriptions = new Map();
  for (const route of routes) {
    const { markup, helmet } = renderPage(route);
    const head = getHelmetHead(helmet);
    const html = replaceHead(template, head).replace(
      '<div id="root"></div>',
      `<div id="root" data-prerendered="true">${markup}</div>`,
    );
    if (html === template || !html.includes(`data-prerendered="true"`)) {
      throw new Error(`${route}: failed to inject prerendered body into index.html.`);
    }
    const expectedCanonical = `${seo.SITE_URL}${route === '/' ? '/' : route}`;
    const pageMetadata = validatePrerenderedHtml(html, route, expectedCanonical);
    const duplicateTitle = seenTitles.get(pageMetadata.title);
    if (duplicateTitle) throw new Error(`Duplicate SEO title on ${duplicateTitle} and ${route}: ${pageMetadata.title}`);
    seenTitles.set(pageMetadata.title, route);
    if (pageMetadata.title.length > 60) console.warn(`[SEO audit] ${route}: title is ${pageMetadata.title.length} characters (review for search-result truncation).`);
    if (pageMetadata.description.length < 120 || pageMetadata.description.length > 160) {
      console.warn(`[SEO audit] ${route}: meta description is ${pageMetadata.description.length} characters (target 120–160 where natural).`);
    }
    const duplicateDescription = seenDescriptions.get(pageMetadata.description);
    if (duplicateDescription) throw new Error(`Duplicate meta description on ${duplicateDescription} and ${route}.`);
    seenDescriptions.set(pageMetadata.description, route);
    auditInternalLinks(html, route, routeSet);

    const outputDir = route === '/' ? dist : path.join(dist, route.slice(1));
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
    renderedCount += 1;
  }

  // Publish a useful noindex 404 document for static hosts that support /404.html.
  const notFound = renderPage('/__prerendered_404__');
  const notFoundHtml = replaceHead(template, getHelmetHead(notFound.helmet)).replace(
    '<div id="root"></div>',
    `<div id="root" data-prerendered="true">${notFound.markup}</div>`,
  );
  if (!/<meta\s+[^>]*name=["']robots["'][^>]*content=["']noindex, follow["']/i.test(notFoundHtml)) {
    throw new Error('404.html must include a noindex,follow robots directive.');
  }
  if (/<link\s+[^>]*rel=["']canonical["']/i.test(notFoundHtml)) {
    throw new Error('404.html must not include a canonical URL.');
  }
  await fs.writeFile(path.join(dist, '404.html'), notFoundHtml, 'utf8');

  const lastmod = seo.CONTENT_LAST_MODIFIED;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${escapeXml(`${seo.SITE_URL}${route === '/' ? '/' : route}`)}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');
  await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${seo.SITE_URL}/sitemap.xml\n`, 'utf8');

  console.log(`[SEO prerender] Rendered ${renderedCount} indexable routes.`);
  console.log(`[SEO prerender] Wrote sitemap.xml (${routes.length} URLs), robots.txt, and 404.html.`);
  console.log('[SEO prerender] Required metadata and JSON-LD checks passed. H1 warnings, if any, should be reviewed.');
} finally {
  await server.close();
}
