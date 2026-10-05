// Post-build prerender (no browser needed). For every indexable route it writes dist/<route>/index.html
// with route-specific <head> tags (title, description, canonical, robots, Open Graph, Twitter, JSON-LD)
// AND crawlable body content (H1, intro, how-to, example, FAQ, related links) inside #root.
// React (createRoot) replaces that markup on load, and react-helmet-async (SeoHead.jsx) then keeps
// the head in sync during SPA navigation. All text comes from data/*.js, the same data the React pages use.
//
// Usage: runs automatically via the "postbuild" npm script after `vite build`.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, SITE_NAME, DEFAULT_IMAGE, OG_IMAGE_PATH, getIndexableRoutes, getRouteSeo, getRelatedTools } from '../src/data/seo.js';
import { TOOLS, CATEGORIES } from '../src/data/tools.js';
import { getToolContent } from '../src/data/toolContent.js';
import { TOOL_SEO_DATA } from '../src/data/toolSeoData.js';
import { HOME_POPULAR, HOME_LINK_GROUPS, HOME_FAQS } from '../src/data/seo.js';
import { categoryPath } from '../src/data/categoryContent.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const canon = (p) => (p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}`);
const DEFAULT_ALT = 'Free online developer tools: JSON formatter, JWT decoder, UUID generator and Base64 tools';
const ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1';

// ---- fail loudly if the app and the SEO data disagree ------------------------------------------
const appSrc = readFileSync(resolve(root, 'src/App.jsx'), 'utf8');
const appPaths = new Set([...appSrc.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]));
const routes = [...new Set(getIndexableRoutes())];
const missing = routes.filter((r) => !appPaths.has(r) && !r.startsWith('/category/'));
if (missing.length) throw new Error(`Routes in SEO data but not in App.jsx: ${missing.join(', ')}`);
if (!appSrc.includes('CATEGORY_ROUTES')) throw new Error('App.jsx does not register CATEGORY_ROUTES');
if (!existsSync(resolve(dist, '.' + OG_IMAGE_PATH))) throw new Error(`Missing ${OG_IMAGE_PATH} in dist (put it in public/images)`);

// ---- <head> -----------------------------------------------------------------------------------
function headTags(path, seo, { noindex = false } = {}) {
  const url = canon(path);
  const social = seo.social || seo.description;
  const alt = seo.kind === 'home' ? 'Free Online Developer Tools' : DEFAULT_ALT;
  const m = (attr, key, val) => `    <meta data-rh="true" ${attr}="${key}" content="${esc(val)}" />`;
  const out = [
    `    <title>${esc(seo.title)}</title>`,
    m('name', 'description', seo.description),
    m('name', 'robots', noindex ? 'noindex, follow' : ROBOTS),
    ...(noindex ? [] : [`    <link data-rh="true" rel="canonical" href="${url}" />`]),
    m('property', 'og:type', 'website'),
    m('property', 'og:locale', 'en_US'),
    m('property', 'og:site_name', SITE_NAME),
    m('property', 'og:title', seo.title),
    m('property', 'og:description', social),
    ...(noindex ? [] : [m('property', 'og:url', url)]),
    m('property', 'og:image', DEFAULT_IMAGE),
    m('property', 'og:image:width', '1200'),
    m('property', 'og:image:height', '630'),
    m('property', 'og:image:alt', alt),
    m('name', 'twitter:card', 'summary_large_image'),
    m('name', 'twitter:title', seo.title),
    ...(noindex ? [] : [m('name', 'twitter:url', url)]),
    m('name', 'twitter:description', social),
    m('name', 'twitter:image', DEFAULT_IMAGE),
    m('name', 'twitter:image:alt', alt),
  ];
  if (seo.jsonLd) {
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c');
    out.push(`    <script data-rh="true" type="application/ld+json">${json}</script>`);
  }
  return out.join('\n');
}

// ---- body (crawlable content that mirrors the React page) -------------------------------------
const a = (to, label) => `<a href="${to}">${esc(label)}</a>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const crumbs = (items) => `<nav aria-label="Breadcrumb"><ol>${items.map(([to, l]) => `<li>${to ? a(to, l) : esc(l)}</li>`).join('')}</ol></nav>`;

function toolBody(path, seo) {
  const t = seo.tool;
  const c = t.content;
  const items = [['/', 'Home']];
  if (t.tool && t.categoryPath) items.push([t.categoryPath, t.tool.category]);
  items.push([null, t.name]);
  let h = crumbs(items) + `<h1>${esc(t.h1)}</h1><p>${esc(c.lede)}</p>`;
  h += `<h2>What is ${esc(t.name)}?</h2><p>${esc(c.what)}</p><h2>What problem does it solve?</h2><p>${esc(c.problem)}</p>`;
  h += `<h2>How to use ${esc(t.name)}</h2><ol>${c.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`;
  h += `<h2>Example</h2><p>${esc(c.example.inLabel)}</p><pre>${esc(c.example.input)}</pre><p>${esc(c.example.outLabel)}</p><pre>${esc(c.example.output)}</pre>`;
  h += `<h2>Common use cases</h2>${ul(c.useCases.map(esc))}`;
  for (const s of c.sections || []) {
    h += `<h2>${esc(s.h)}</h2>`;
    (s.paras || []).forEach((p) => { h += `<p>${esc(p)}</p>`; });
    if (s.list) h += ul(s.list.map(esc));
    if (s.code) h += `<pre>${esc(s.code)}</pre>`;
    if (s.links) h += `<p>${esc(s.linksLabel || 'Related')}: ${s.links.map(([l, to]) => a(to, l)).join(', ')}</p>`;
  }
  h += `<h2>${esc(t.name)} FAQ</h2>${c.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}`;
  const rel = getRelatedTools(path, c.group, t.tool && t.tool.category);
  if (rel.length) h += `<h2>Related Developer Tools</h2>${ul(rel.map((r) => a(r.path, r.name)))}`;
  return h;
}

function categoryBody(seo) {
  const c = seo.category;
  const tools = TOOLS.filter((t) => t.category === c.category);
  let h = crumbs([['/', 'Home'], ['/categories', 'Categories'], [null, c.category]]) + `<h1>${esc(c.h1)}</h1>`;
  h += c.intro.map((p) => `<p>${esc(p)}</p>`).join('');
  h += `<h2>Which ${esc(c.category.toLowerCase())} tool do you need?</h2>`;
  h += ul(c.guide.map((g) => `<strong>${esc(g.need)}:</strong> ${a(g.to, TOOLS.find((t) => t.path === g.to).name)}. ${esc(g.text)}`));
  h += `<h2>All ${esc(c.category.toLowerCase())}</h2>` + ul(tools.map((t) => `${a(t.path, t.name)} - ${esc(getToolContent(t.path, t.name).lede)}`));
  return h;
}

function homeBody(seo) {
  let h = `<h1>${esc(seo.h1)}</h1><p>${esc(seo.description)}</p>`;
  h += `<h2>Popular Developer Tools</h2>` + ul(HOME_POPULAR.map((p) => `${a(p.path, p.name)} - ${esc(p.blurb)}`));
  h += `<h2>Browse by category</h2>` + ul(CATEGORIES.map((c) => a(categoryPath(c) || `/tools?category=${encodeURIComponent(c)}`, c)));
  HOME_LINK_GROUPS.forEach((g) => { h += `<h2>${esc(g.h)}</h2><p>${esc(g.p)}</p>` + ul(g.links.map(([l, to]) => a(to, l))); });
  h += `<h2>Questions developers ask</h2>` + HOME_FAQS.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('');
  return h;
}

function listBody(seo) {
  let h = `<h1>${esc(seo.h1)}</h1><p>${esc(seo.description)}</p>`;
  if (seo.h1 === 'All Developer Tools' || seo.h1 === 'Categories') {
    CATEGORIES.forEach((c) => {
      h += `<h2>${categoryPath(c) ? a(categoryPath(c), c) : esc(c)}</h2>` + ul(TOOLS.filter((t) => t.category === c).map((t) => a(t.path, t.name)));
    });
  }
  return h;
}

function bodyFor(path, seo) {
  if (seo.kind === 'tool') return toolBody(path, seo);
  if (seo.kind === 'category') return categoryBody(seo);
  if (seo.kind === 'home') return homeBody(seo);
  return listBody(seo);
}

// ---- assemble ---------------------------------------------------------------------------------
const HEAD_RE = /<!-- SEO-HEAD:START[\s\S]*?SEO-HEAD:END -->/;
if (!HEAD_RE.test(template)) throw new Error('SEO-HEAD markers not found in dist/index.html');
const ROOT_RE = /<div id="root">\s*<\/div>/;
if (!ROOT_RE.test(template)) throw new Error('<div id="root"></div> not found in dist/index.html');

function render(path, seo, opts) {
  let html = template.replace(HEAD_RE, `<!-- SEO-HEAD:START (prerendered) -->\n${headTags(path, seo, opts)}\n    <!-- SEO-HEAD:END -->`);
  if (opts && opts.noindex) return html;
  return html.replace(ROOT_RE, `<div id="root"><div data-prerendered="true">${bodyFor(path, seo)}</div></div>`);
}

const report = [];
for (const path of routes) {
  const seo = getRouteSeo(path);
  const html = render(path, seo);

  // per-page checks
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const titles = (html.match(/<title>/g) || []).length;
  const canonicals = [...html.matchAll(/rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  if (h1s !== 1) throw new Error(`${path}: expected 1 <h1>, found ${h1s}`);
  if (titles !== 1) throw new Error(`${path}: expected 1 <title>, found ${titles}`);
  if (canonicals.length !== 1 || canonicals[0] !== canon(path)) throw new Error(`${path}: bad canonical ${canonicals}`);
  if (/name="keywords"/.test(html)) throw new Error(`${path}: meta keywords must not be present`);

  const outFile = path === '/' ? resolve(dist, 'index.html') : resolve(dist, '.' + path, 'index.html');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);

  const cfg = TOOL_SEO_DATA[path];
  const faqCount = seo.kind === 'tool' ? seo.tool.content.faqs.length : seo.kind === 'home' ? HOME_FAQS.length : 0;
  const schema = seo.jsonLd ? [...new Set(seo.jsonLd['@graph'].map((n) => n['@type']))].join(' + ') : '-';
  report.push({ path, title: seo.title, description: seo.description, canonical: canon(path), h1: seo.h1, primary: cfg ? cfg.primary : '-', secondary: cfg ? cfg.secondary : [], longTail: cfg ? cfg.longTail : [], faq: faqCount, schema });
}

// noindex 404 shell for hosts that serve /404.html for unknown URLs
writeFileSync(resolve(dist, '404.html'), render('/404', { kind: 'page', title: `404 - Page Not Found | ${SITE_NAME}`, description: 'That page does not exist. Browse all free developer tools instead.', h1: '404', jsonLd: null }, { noindex: true }));

// validation table
const cell = (s) => String(s).replace(/\|/g, '/');
const md = [
  '| URL | Title | Description | Canonical | H1 | Primary keyword | Secondary keywords | Long-tail | FAQs | Schema |',
  '|---|---|---|---|---|---|---|---|---|---|',
  ...report.map((r) => `| ${r.path} | ${cell(r.title)} | ${cell(r.description)} | ${r.canonical} | ${cell(r.h1)} | ${r.primary} | ${r.secondary.join('; ')} | ${r.longTail.join('; ')} | ${r.faq} | ${r.schema} |`),
];
writeFileSync(resolve(root, 'seo-report.md'), md.join('\n') + '\n');
console.log(`prerendered ${routes.length} routes + 404.html; report written to seo-report.md`);
