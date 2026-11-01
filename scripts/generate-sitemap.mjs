// Writes public/sitemap.xml from the same route list the prerender uses (data/seo.js),
// so the sitemap can never drift from the app. Runs automatically before `vite build`
// via the "prebuild" npm script. Only clean canonical URLs are listed: no query strings,
// no 404 page, no duplicates.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, getLastModified, getIndexableRoutes } from '../src/data/seo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const routes = [...new Set(getIndexableRoutes())];
const loc = (p) => (p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}`);

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes.map((p) => `  <url>\n    <loc>${loc(p)}</loc>\n    <lastmod>${getLastModified(p)}</lastmod>\n  </url>`).join('\n') +
  '\n</urlset>\n';

mkdirSync(resolve(root, 'public'), { recursive: true });
writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml: ${routes.length} URLs`);
