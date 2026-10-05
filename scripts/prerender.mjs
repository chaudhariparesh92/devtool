// Static prerender for the Vite + React SPA. Run AFTER `vite build`:
//
//   node scripts/prerender.mjs [distDir]        (default distDir: dist)
//
// What it does (no framework migration, no change to app code):
//   - For every route it writes dist/<route>/index.html (dist/index.html for "/") containing the
//     page's own <title>, meta description, canonical, Open Graph, Twitter and JSON-LD tags, plus
//     real crawlable HTML (h1, intro, steps, FAQ, internal links) inside #root.
//   - When the browser loads the page, React's createRoot replaces that HTML with the live app,
//     and react-helmet-async swaps the head tags it manages (they carry data-rh="true").
//   - It also writes dist/sitemap.xml from data/tools.js, so new tools are picked up automatically.
//
// Requires Node 18+ and "type": "module" in package.json (the default Vite template).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, process.argv[2] || 'dist');
const load = (f) => import(pathToFileURL(join(root, 'src', 'data', f)).href);

let seo, toolsMod;
try {
  seo = await load('seo.js');
  toolsMod = await load('tools.js');
} catch (e) {
  console.error('Could not import src/data/*.js. Make sure package.json contains "type": "module".\n', e);
  process.exit(1);
}
const { TOOLS, CATEGORIES, CATEGORY_INFO } = toolsMod;
const {
  SITE_URL, SITE_NAME, DEFAULT_IMAGE, CONTENT_LAST_MODIFIED,
  HOME_TITLE, HOME_DESC, HOME_SOCIAL_DESC, HOME_POPULAR, HOME_LINK_GROUPS, HOME_WHY, HOME_FAQS,
  PAGE_SEO, getHomeJsonLd, getToolSeo, getRelatedTools,
} = seo;

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const HEAD_RE = /<!-- SEO-HEAD:START[\s\S]*?SEO-HEAD:END -->/;
const ROOT = '<div id="root"></div>';
if (!HEAD_RE.test(template) || !template.includes(ROOT)) {
  console.error('dist/index.html is missing the SEO-HEAD markers or <div id="root"></div>. Was index.html changed?');
  process.exit(1);
}

// ------------------------------------------------------------------ helpers
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const a = (to, label) => `<a href="${esc(to)}">${esc(label)}</a>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const faqHtml = (faqs) => faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('');

function headHtml({ title, description, socialDescription, path, jsonLd, noindex }) {
  const url = `${SITE_URL}${path}`;
  const social = socialDescription || description;
  const m = (attr, name, content) => `<meta data-rh="true" ${attr}="${name}" content="${esc(content)}" />`;
  return [
    `<title>${esc(title)}</title>`,
    m('name', 'description', description),
    m('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'),
    noindex ? '' : `<link data-rh="true" rel="canonical" href="${url}" />`,
    m('property', 'og:type', 'website'),
    m('property', 'og:locale', 'en_US'),
    m('property', 'og:site_name', SITE_NAME),
    m('property', 'og:title', title),
    m('property', 'og:description', social),
    noindex ? '' : m('property', 'og:url', url),
    m('property', 'og:image', DEFAULT_IMAGE),
    m('property', 'og:image:width', '1200'),
    m('property', 'og:image:height', '630'),
    m('property', 'og:image:alt', 'Free online developer tools: JSON formatter, JWT decoder, UUID generator and Base64 tools'),
    m('name', 'twitter:card', 'summary_large_image'),
    m('name', 'twitter:title', title),
    noindex ? '' : m('name', 'twitter:url', url),
    m('name', 'twitter:description', social),
    m('name', 'twitter:image', DEFAULT_IMAGE),
    jsonLd ? `<script data-rh="true" type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ');
}

const SITE_NAV = `<nav aria-label="Main">${a('/', 'Home')} | ${a('/tools', 'All Tools')} | ${a('/categories', 'Categories')}</nav>`;

function wrap(body) {
  // Plain, readable HTML. React replaces it on load, so it never fights the app's own styling.
  return `<div id="root"><div style="max-width:1000px;margin:0 auto;padding:24px 16px;line-height:1.6">${SITE_NAV}${body}</div></div>`;
}

// ------------------------------------------------------------------ page bodies
function homeBody() {
  return `
<h1>Free Online Developer Tools</h1>
<p>Free browser-based tools for developers including JSON Formatter, JSON Validator, JWT Decoder, Base64 Encoder and UUID Generator. Format JSON, decode a token, convert a timestamp or generate a UUID in seconds, with no signup required.</p>
<h2>Popular Developer Tools</h2>
${ul(HOME_POPULAR.map((p) => `${a(p.path, p.name)} - ${esc(p.blurb)}`))}
<h2>JSON, JWT and encoding tools</h2>
${HOME_LINK_GROUPS.map((g) => `<h3>${esc(g.h)}</h3><p>${esc(g.p)}</p>${ul(g.links.map(([l, to]) => a(to, l)))}`).join('')}
<h2>Browse by what you are trying to do</h2>
${ul(CATEGORIES.map((c) => `${a('/tools?category=' + encodeURIComponent(c), c)} - ${esc(CATEGORY_INFO[c])}`))}
<h2>All developer tools</h2>
${CATEGORIES.map((c) => `<h3>${esc(c)}</h3>${ul(TOOLS.filter((t) => t.category === c).map((t) => a(t.path, t.name)))}`).join('')}
<h2>Why use our developer tools?</h2>
${ul(HOME_WHY.map((w) => `<strong>${esc(w.h)}.</strong> ${esc(w.p)}`))}
<h2>Questions developers ask</h2>
${faqHtml(HOME_FAQS)}`;
}

function toolBody(path) {
  const s = getToolSeo(path, path);
  const { tool, name, content: c } = s;
  const related = getRelatedTools(path, c.group, tool.category);
  const sections = (c.sections || []).map((sec) => `
<h2>${esc(sec.h)}</h2>
${(sec.paras || []).map((p) => `<p>${esc(p)}</p>`).join('')}
${sec.list ? ul(sec.list.map(esc)) : ''}
${sec.code ? `<pre>${esc(sec.code)}</pre>` : ''}
${sec.links ? `<p>${esc(sec.linksLabel || 'Related')}: ${sec.links.map(([l, to]) => a(to, l)).join(', ')}</p>` : ''}`).join('');
  return `
<nav aria-label="Breadcrumb">${a('/', 'Home')} &rsaquo; ${a('/tools?category=' + encodeURIComponent(tool.category), tool.category)} &rsaquo; ${esc(name)}</nav>
<h1>${esc(name)}</h1>
<p>${esc(c.lede)}</p>
<h2>What is ${esc(name)}?</h2>
<p>${esc(c.what)}</p>
<h2>What problem does it solve?</h2>
<p>${esc(c.problem)}</p>
<h2>How to use ${esc(name)}</h2>
<ol>${c.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
<h2>Example</h2>
<p>${esc(c.example.inLabel)}:</p><pre>${esc(c.example.input)}</pre>
<p>${esc(c.example.outLabel)}:</p><pre>${esc(c.example.output)}</pre>
<h2>Common use cases</h2>
${ul(c.useCases.map(esc))}
<h2>Related developer tasks</h2>
${ul(c.tasks.map(esc))}
${sections}
<h2>${esc(name)} FAQ</h2>
${faqHtml(c.faqs)}
<h2>You might also need</h2>
${ul(related.map((r) => a(r.path, r.name)))}
<p>Looking for something else? ${a('/tools', 'Browse all developer tools')}.</p>`;
}

function toolsBody() {
  return `<h1>${esc(PAGE_SEO['/tools'].h1)}</h1><p>Select a tool to get started. Everything runs in your browser.</p>
${CATEGORIES.map((c) => `<h2>${esc(c)}</h2><p>${esc(CATEGORY_INFO[c])}</p>${ul(TOOLS.filter((t) => t.category === c).map((t) => a(t.path, t.name)))}`).join('')}`;
}
function categoriesBody() {
  return `<h1>${esc(PAGE_SEO['/categories'].h1)}</h1><p>Pick the kind of chore you are facing. Every category links to working, browser-based tools.</p>
${CATEGORIES.map((c) => `<h2>${esc(c)}</h2><p>${esc(CATEGORY_INFO[c])}</p>${ul(TOOLS.filter((t) => t.category === c).map((t) => a(t.path, t.name)))}`).join('')}`;
}
function staticBody(path) {
  const p = PAGE_SEO[path];
  return `<h1>${esc(p.h1)}</h1><p>${esc(p.description)}</p><p>${a('/tools', 'Explore all developer tools')} | ${a('/json-formatter', 'JSON Formatter')}</p>`;
}

// ------------------------------------------------------------------ route table
const routes = [
  { path: '/', title: HOME_TITLE, description: HOME_DESC, socialDescription: HOME_SOCIAL_DESC, jsonLd: getHomeJsonLd(), body: homeBody() },
  { path: '/tools', ...PAGE_SEO['/tools'], body: toolsBody() },
  { path: '/categories', ...PAGE_SEO['/categories'], body: categoriesBody() },
  ...['/about', '/contact', '/privacy', '/terms'].map((p) => ({ path: p, ...PAGE_SEO[p], body: staticBody(p) })),
  ...TOOLS.map((t) => {
    const s = getToolSeo(t.path, t.name);
    return { path: t.path, title: s.title, description: s.description, jsonLd: s.jsonLd, body: toolBody(t.path) };
  }),
];

// ------------------------------------------------------------------ write pages
const report = [];
for (const r of routes) {
  const html = template
    .replace(HEAD_RE, () => headHtml(r))
    .replace(ROOT, () => wrap(r.body));
  const out = r.path === '/' ? join(dist, 'index.html') : join(dist, r.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  report.push({
    path: r.path,
    canonicals: (html.match(/rel="canonical"/g) || []).length,
    h1: (html.match(/<h1[ >]/g) || []).length,
    descriptions: (html.match(/name="description"/g) || []).length,
  });
}

// ------------------------------------------------------------------ sitemap
const prio = (p) => (p === '/' ? '1.0' : p === '/tools' || p === '/categories' ? '0.8' : ['/about', '/contact', '/privacy', '/terms'].includes(p) ? '0.3' : '0.7');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${CONTENT_LAST_MODIFIED}</lastmod>
    <priority>${prio(r.path)}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);

const problems = report.filter((x) => x.canonicals !== 1 || x.h1 !== 1 || x.descriptions !== 1);
console.log(`Prerendered ${routes.length} pages + sitemap.xml into ${dist}`);
if (problems.length) {
  console.error('Pages failing the 1 canonical / 1 h1 / 1 description check:', problems);
  process.exit(1);
}
