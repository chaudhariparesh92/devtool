import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const templatePath = path.join(dist, 'index.html');

const START = '<!-- SEO-HEAD:START';
const END = '<!-- SEO-HEAD:END -->';
const ROOT_PLACEHOLDER = '<div id="root"></div>';

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
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function safeRoutePath(route) {
  if (
    typeof route !== 'string' ||
    !route.startsWith('/') ||
    route.startsWith('//') ||
    route.includes('..')
  ) {
    throw new Error(`Unsafe route path in SEO data: ${String(route)}`);
  }

  return route;
}

function getHelmetHead(helmet) {
  if (!helmet) {
    throw new Error(
      'No react-helmet-async metadata was collected during prerendering.'
    );
  }

  return [
    helmet.title?.toString(),
    helmet.meta?.toString(),
    helmet.link?.toString(),
    helmet.script?.toString(),
  ]
    .filter(Boolean)
    .join('\n    ');
}

function replaceHead(template, head) {
  const start = template.indexOf(START);
  const end = template.indexOf(END);

  if (start < 0 || end < 0 || end <= start) {
    throw new Error(
      'Could not find SEO-HEAD markers in index.html. Keep SEO-HEAD:START and SEO-HEAD:END in the template.'
    );
  }

  const closeOfStartComment = template.indexOf('-->', start);

  if (closeOfStartComment < 0 || closeOfStartComment > end) {
    throw new Error('Malformed SEO-HEAD:START comment.');
  }

  return `${template.slice(0, start)}<!-- SEO-HEAD:START -->\n    ${head}\n    ${template.slice(end)}`;
}

function injectMarkup(template, markup) {
  if (!template.includes(ROOT_PLACEHOLDER)) {
    throw new Error(
      'Could not find <div id="root"></div> in dist/index.html.'
    );
  }

  return template.replace(
    ROOT_PLACEHOLDER,
    `<div id="root" data-prerendered="true">${markup}</div>`
  );
}

function extractTag(html, regex, label, route) {
  // matchAll() requires a global regular expression.
  const globalRegex = new RegExp(
    regex.source,
    regex.flags.includes('g') ? regex.flags : `${regex.flags}g`
  );

  const matches = [...html.matchAll(globalRegex)];

  if (matches.length !== 1) {
    throw new Error(
      `${route}: expected exactly one ${label}, found ${matches.length}.`
    );
  }

  return matches[0][1];
}

function validatePrerenderedHtml(html, route, expectedUrl) {
  const title = extractTag(
    html,
    /<title[^>]*>([\s\S]*?)<\/title>/i,
    'title',
    route
  );

  const description = extractTag(
    html,
    /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*\/?>/i,
    'meta description',
    route
  );

  const canonicals = [
    ...html.matchAll(
      /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*\/?>/gi
    ),
  ];

  if (canonicals.length !== 1) {
    throw new Error(
      `${route}: expected exactly one canonical link, found ${canonicals.length}.`
    );
  }

  if (canonicals[0][1] !== expectedUrl) {
    throw new Error(
      `${route}: canonical mismatch. Expected ${expectedUrl}, received ${canonicals[0][1]}.`
    );
  }

  const cleanTitle = decodeHtmlEntities(
    title.replace(/<[^>]+>/g, '').trim()
  );

  const cleanDescription = decodeHtmlEntities(description.trim());

  if (!cleanTitle) {
    throw new Error(`${route}: empty title.`);
  }

  if (!cleanDescription) {
    throw new Error(`${route}: empty meta description.`);
  }

  const h1Count = [...html.matchAll(/<h1\b/gi)].length;

  if (h1Count !== 1) {
    console.warn(
      `[SEO audit] ${route}: expected one H1, found ${h1Count}.`
    );
  }

  if (
    !/<meta\s+[^>]*name=["']robots["'][^>]*content=["']index,\s*follow/i.test(
      html
    )
  ) {
    throw new Error(
      `${route}: indexable route is missing an index,follow robots directive.`
    );
  }

  const ldScripts = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];

  for (const [, raw] of ldScripts) {
    try {
      JSON.parse(raw);
    } catch (error) {
      throw new Error(`${route}: invalid JSON-LD: ${error.message}`);
    }
  }

  if (!html.includes('data-prerendered="true"')) {
    throw new Error(`${route}: prerendered root marker missing.`);
  }

  for (const [label, regex] of [
    ['Open Graph title', /<meta\s+[^>]*property=["']og:title["']/gi],
    ['Open Graph description', /<meta\s+[^>]*property=["']og:description["']/gi],
    ['Twitter title', /<meta\s+[^>]*name=["']twitter:title["']/gi],
    ['Twitter description', /<meta\s+[^>]*name=["']twitter:description["']/gi],
  ]) {
    const count = [...html.matchAll(regex)].length;

    if (count !== 1) {
      throw new Error(
        `${route}: expected exactly one ${label}, found ${count}.`
      );
    }
  }

  return {
    title: cleanTitle,
    description: cleanDescription,
  };
}

function auditInternalLinks(html, route, knownRoutes) {
  const problems = new Set();

  for (const [, href] of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    if (
      !href.startsWith('/') ||
      href.startsWith('//') ||
      href.startsWith('/#')
    ) {
      continue;
    }

    let pathname = href.split(/[?#]/, 1)[0];

    try {
      pathname = decodeURIComponent(pathname);
    } catch {
      // Retain the literal path for the audit.
    }

    if (pathname.length > 1) {
      pathname = pathname.replace(/\/+$/, '');
    }

    if (/\.[a-z0-9]{2,8}$/i.test(pathname)) {
      continue;
    }

    if (!knownRoutes.has(pathname)) {
      problems.add(pathname);
    }
  }

  if (problems.size) {
    console.warn(
      `[SEO audit] ${route}: internal links target paths not present in the route registry: ${[...problems].join(', ')}`
    );
  }
}

function generateSitemap(seo, routes) {
  const urls = routes.map((route) => {
    const loc = `${seo.SITE_URL}${route === '/' ? '/' : route}`;
    const lastmod = seo.getLastModified(route);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
      throw new Error(
        `Invalid sitemap lastmod date for ${route}: ${lastmod}`
      );
    }

    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

function validateSitemap(sitemap, seo, routes) {
  const locs = [
    ...sitemap.matchAll(/<loc>(.*?)<\/loc>/g),
  ].map((match) => match[1]);

  if (locs.length !== routes.length) {
    throw new Error(
      `Sitemap URL count mismatch. Expected ${routes.length}, found ${locs.length}.`
    );
  }

  for (const route of routes) {
    const expectedUrl = `${seo.SITE_URL}${route === '/' ? '/' : route}`;

    if (!locs.includes(expectedUrl)) {
      throw new Error(`Sitemap is missing URL: ${expectedUrl}`);
    }
  }

  if (locs.length !== new Set(locs).size) {
    throw new Error('Sitemap contains duplicate URLs.');
  }

  const lastmods = [
    ...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g),
  ].map((match) => match[1]);

  if (lastmods.length !== routes.length) {
    throw new Error('Sitemap contains missing or extra lastmod values.');
  }

  return true;
}

async function writeFileAndVerify(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');

  const written = await fs.readFile(filePath, 'utf8');

  if (written !== content) {
    throw new Error(`File verification failed: ${filePath}`);
  }
}

async function main() {
  // Ensure Vite has completed its production build before running this script.
  await fs.access(templatePath);

  const template = await fs.readFile(templatePath, 'utf8');

  const server = await createServer({
    configFile: path.join(root, 'vite.config.js'),
    root,
    server: {
      middlewareMode: true,
    },
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
      try {
        await fs.access(path.join(root, 'public', asset));
      } catch {
        throw new Error(
          `Required referenced public asset is missing: public/${asset}`
        );
      }
    }

    const [{ renderPage }, seo, app] = await Promise.all([
      server.ssrLoadModule('/src/entry-server.jsx'),
      server.ssrLoadModule('/src/data/seo.js'),
      server.ssrLoadModule('/src/App.jsx'),
    ]);

    const routes = seo.getIndexableRoutes().map(safeRoutePath);
    const routeSet = new Set(routes);

    if (routeSet.size !== routes.length) {
      throw new Error('SEO route list contains duplicate paths.');
    }

    const appPaths = new Set(app.routes.map((route) => route.path));

    const missingAppRoutes = routes.filter(
      (route) => !appPaths.has(route)
    );

    if (missingAppRoutes.length) {
      throw new Error(
        `Routes in SEO data are missing from App.jsx: ${missingAppRoutes.join(', ')}`
      );
    }

    let renderedCount = 0;

    const seenTitles = new Map();
    const seenDescriptions = new Map();

    for (const route of routes) {
      const { markup, helmet } = renderPage(route);

      const head = getHelmetHead(helmet);

      const html = injectMarkup(
        replaceHead(template, head),
        markup
      );

      const expectedCanonical =
        `${seo.SITE_URL}${route === '/' ? '/' : route}`;

      const pageMetadata = validatePrerenderedHtml(
        html,
        route,
        expectedCanonical
      );

      const duplicateTitle = seenTitles.get(pageMetadata.title);

      if (duplicateTitle) {
        throw new Error(
          `Duplicate SEO title on ${duplicateTitle} and ${route}: ${pageMetadata.title}`
        );
      }

      seenTitles.set(pageMetadata.title, route);

      if (pageMetadata.title.length > 60) {
        console.warn(
          `[SEO audit] ${route}: title is ${pageMetadata.title.length} characters.`
        );
      }

      if (
        pageMetadata.description.length < 120 ||
        pageMetadata.description.length > 160
      ) {
        console.warn(
          `[SEO audit] ${route}: meta description is ${pageMetadata.description.length} characters (target 120–160 where natural).`
        );
      }

      const duplicateDescription = seenDescriptions.get(
        pageMetadata.description
      );

      if (duplicateDescription) {
        throw new Error(
          `Duplicate meta description on ${duplicateDescription} and ${route}.`
        );
      }

      seenDescriptions.set(pageMetadata.description, route);

      auditInternalLinks(html, route, routeSet);

      const outputDir =
        route === '/'
          ? dist
          : path.join(dist, route.slice(1));

      await writeFileAndVerify(
        path.join(outputDir, 'index.html'),
        html
      );

      renderedCount++;
    }

    // Generate a useful noindex 404 page.
    const notFound = renderPage('/__prerendered_404__');

    const notFoundHtml = injectMarkup(
      replaceHead(template, getHelmetHead(notFound.helmet)),
      notFound.markup
    );

    if (
      !/<meta\s+[^>]*name=["']robots["'][^>]*content=["']noindex,\s*follow["']/i.test(
        notFoundHtml
      )
    ) {
      throw new Error(
        '404.html must include a noindex,follow robots directive.'
      );
    }

    if (/<link\s+[^>]*rel=["']canonical["']/i.test(notFoundHtml)) {
      throw new Error('404.html must not include a canonical URL.');
    }

    await writeFileAndVerify(
      path.join(dist, '404.html'),
      notFoundHtml
    );

    // Always regenerate the sitemap from the current SEO registry.
    const sitemap = generateSitemap(seo, routes);

    validateSitemap(sitemap, seo, routes);

    const sitemapPath = path.join(dist, 'sitemap.xml');

    await writeFileAndVerify(sitemapPath, sitemap);

    // Always regenerate robots.txt as well.
    const robots = [
      'User-agent: *',
      'Allow: /',
      `Sitemap: ${seo.SITE_URL}/sitemap.xml`,
      '',
    ].join('\n');

    await writeFileAndVerify(
      path.join(dist, 'robots.txt'),
      robots
    );

    // Final verification of generated output.
    const finalSitemap = await fs.readFile(sitemapPath, 'utf8');

    validateSitemap(finalSitemap, seo, routes);

    const sitemapStats = await fs.stat(sitemapPath);

    console.log('');
    console.log('========== SEO PRERENDER COMPLETE ==========');
    console.log(`[SEO prerender] Rendered routes: ${renderedCount}`);
    console.log(`[SEO prerender] Sitemap URLs: ${routes.length}`);
    console.log(`[SEO prerender] Sitemap: ${sitemapPath}`);
    console.log(`[SEO prerender] Sitemap size: ${sitemapStats.size} bytes`);
    console.log(
      `[SEO prerender] Latest content date: ${seo.CONTENT_LAST_MODIFIED}`
    );
    console.log(`[SEO prerender] Robots: ${path.join(dist, 'robots.txt')}`);
    console.log(`[SEO prerender] 404: ${path.join(dist, '404.html')}`);
    console.log('[SEO prerender] Sitemap verification passed.');
    console.log('[SEO prerender] Metadata and JSON-LD checks passed.');
    console.log('============================================');
    console.log('');
  } finally {
    await server.close();
  }
}

main().catch((error) => {
  console.error('\n[SEO prerender] BUILD FAILED');
  console.error(error);
  process.exitCode = 1;
});