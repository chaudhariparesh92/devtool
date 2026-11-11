
// Single source of truth for SEO metadata.
// Pure data + pure functions (no React) so the same values feed:
//   1. the React pages (SeoHead / ToolLayout / Home), and
//   2. scripts/prerender.mjs, which writes real per-route HTML after `vite build`.
// Nothing here touches tool logic.

import { TOOLS } from './tools.js';
import { getToolContent } from './toolContent.js';
import { TOOL_SEO_DATA } from './toolSeoData.js';
import { SEO_RESEARCH } from './seoResearch.js';
import { CATEGORY_PAGES, categoryPath } from './categoryContent.js';
import { GUIDES, GUIDE_ROUTES, GUIDES_UPDATED, getGuide } from './guides.js';
import { KEYWORD_BOOST } from './keywordBoost.js';

export const SITE_URL = 'https://onlinedevelopertool.com';
export const SITE_NAME = 'OnlineDeveloperTool';
export const SITE_DOMAIN = 'onlinedevelopertool.com';

export const OG_IMAGE_PATH = '/images/og-onlinedevelopertool.webp';
export const DEFAULT_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}`;

/** Absolute canonical URL with trailing slash (except root). Matches prerender + sitemap. */
export function canonicalUrl(path) {
  if (!path || path === '/') return `${SITE_URL}/`;
  const clean = `/${String(path)}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return `${SITE_URL}${clean}/`;
}

// Latest genuine content modification anywhere on the site.
// Update this whenever content is genuinely changed.
// NOTE: every route listed in KEYWORD_BOOST inherits this date, so only change it
// when all of those pages really changed.
export const CONTENT_LAST_MODIFIED = '2026-11-05';

// Per-page dates feed:
// - Visible "Updated" line
// - JSON-LD dateModified
// - Sitemap <lastmod>
//
// Only add routes here when their content or functionality genuinely changes.
// Unlisted routes retain the baseline date.
// Guides carry their own optional `updated` field in data/guides.js.
const BASELINE_MODIFIED = '2026-10-25';

const MODIFIED_ON = {
  '2026-11-11': [
    '/uuid-generator',
    '/html-encoder',
    '/unix-timestamp',
    '/timestamp-converter',
  ],

  '2026-11-10': [
    '/xml-validator',
  ],

  '2026-11-09': [
    '/website-status-checker',
  ],

  '2026-11-05': [
    '/json-to-csharp',
    '/html-decoder',
    '/base64-decoder',
    '/rgb-to-hex',
    '/regex-generator',
    '/xml-validator',
    '/timestamp-converter',
    '/unix-timestamp',
    '/json-formatter',
    '/json-validator',
    '/json-beautifier',
    '/json-minifier',
  ],

  '2026-11-04': [
    '/',
    '/website-status-checker',
    '/rgb-to-hex',
    '/uuid-generator',
    '/html-encoder',
    '/unix-timestamp',
    '/uuid-validator',
  ],

  '2026-10-31': [
    '/categories',
    '/uuid-parser',
    '/hex-to-rgb',
    '/color-converter',
    '/json-validator',
    '/json-beautifier',
    '/json-minifier',
    '/cron-expression-generator',
    '/cron-expression-parser',
    '/json-to-typescript',
    '/json-to-java',
    '/json-to-python',
    '/json-to-go',
    '/url-encoder',
    '/url-decoder',
    '/html-decoder',
    '/timestamp-converter',
    '/xml-formatter',
    '/xml-validator',
    '/yaml-formatter',
    '/case-converter',
    '/text-to-slug',
    '/slug-generator',
    '/number-base-converter',
    '/binary-to-decimal',
    '/decimal-to-binary',
    '/hex-to-decimal',
    '/decimal-to-hex',
  ],
};

const guideDate = (g) => (g && g.updated) || GUIDES_UPDATED;

export function getLastModified(routePath) {
  if (routePath === '/guides') {
    return GUIDES.reduce((latest, g) => (guideDate(g) > latest ? guideDate(g) : latest), GUIDES_UPDATED);
  }

  if (routePath.startsWith('/guides/')) {
    return guideDate(getGuide(routePath));
  }

  let latest = KEYWORD_BOOST[routePath] ? CONTENT_LAST_MODIFIED : null;

  for (const [date, paths] of Object.entries(MODIFIED_ON)) {
    if (paths.includes(routePath) && (!latest || date > latest)) {
      latest = date;
    }
  }

  return latest || BASELINE_MODIFIED;
}

// ---------------------------------------------------------------- Homepage

export const HOME_TITLE = 'Online Developer Tools - Free JSON, JWT, Base64 & More';

export const HOME_DESC =
  'Free online developer tools for JSON, JWT, Base64, UUID, hashing, URLs, timestamps, regex, XML, YAML and more. Fast browser-based utilities with no signup.';

export const HOME_SOCIAL_DESC =
  'Free browser-based developer tools for JSON, JWT, Base64, UUID, hashing, timestamps, regex, XML, YAML and more. No signup required.';

export const HOME_H1 = 'Free Online Developer Tools';

export const HOME_POPULAR = [
  { name: 'JSON Formatter', path: '/json-formatter', blurb: 'Pretty-print or inspect messy JSON in one click.' },
  { name: 'JSON Validator', path: '/json-validator', blurb: 'Check JSON syntax and see the parser error.' },
  { name: 'JSON Beautifier', path: '/json-beautifier', blurb: 'Turn minified JSON into readable, indented JSON.' },
  { name: 'JWT Decoder', path: '/jwt-decoder', blurb: 'Read the header and claims inside a token.' },
  { name: 'Base64 Encoder', path: '/base64-encoder', blurb: 'Encode text, including UTF-8, to Base64.' },
  { name: 'Base64 Decoder', path: '/base64-decoder', blurb: 'Turn Base64 back into readable text.' },
  { name: 'UUID Generator', path: '/uuid-generator', blurb: 'Make random UUIDs in bulk and copy them.' },
  { name: 'JSON to C#', path: '/json-to-csharp', blurb: 'Draft a C# class from a sample JSON object.' },
  { name: 'Timestamp Converter', path: '/timestamp-converter', blurb: 'Unix time to dates, and back again.' },
];

export const HOME_LINK_GROUPS = [
  {
    h: 'JSON tools',
    p: 'Format, validate, minify and convert JSON.',
    links: [
      ['JSON Formatter', '/json-formatter'],
      ['JSON Validator', '/json-validator'],
      ['JSON Beautifier', '/json-beautifier'],
      ['JSON Minifier', '/json-minifier'],
      ['JSON to C#', '/json-to-csharp'],
      ['JSON to TypeScript', '/json-to-typescript'],
      ['JSON to CSV', '/json-to-csv'],
      ['CSV to JSON', '/csv-to-json'],
      ['YAML to JSON', '/yaml-to-json'],
    ],
  },
  {
    h: 'JWT tools',
    p: 'Inspect and build JSON Web Tokens, and read the timestamps inside them.',
    links: [
      ['JWT Decoder', '/jwt-decoder'],
      ['JWT Generator', '/jwt-generator'],
      ['Timestamp Converter', '/timestamp-converter'],
      ['Unix Timestamp', '/unix-timestamp'],
    ],
  },
  {
    h: 'Encoding tools',
    p: 'Encode and decode Base64, URL and HTML text.',
    links: [
      ['Base64 Encoder', '/base64-encoder'],
      ['Base64 Decoder', '/base64-decoder'],
      ['URL Encoder', '/url-encoder'],
      ['URL Decoder', '/url-decoder'],
      ['HTML Encoder', '/html-encoder'],
      ['HTML Decoder', '/html-decoder'],
    ],
  },
];

export const HOME_WHY = [
  { h: 'Free', p: 'Every tool is free to use. There is nothing to buy and no trial.' },
  { h: 'No signup', p: 'There are no accounts. Open a tool, paste your input and copy the result.' },
  { h: 'Runs in your browser', p: 'Processing happens in your browser tab, so pasted text is not uploaded to a server for processing.' },
  { h: 'Fast', p: 'Tools respond instantly because there is no server round trip to wait for.' },
  { h: 'Privacy-minded', p: 'There is no database behind the tools. The one exception to know about is the Website Status Checker, which sends a request from your browser to the address you type.' },
  { h: 'Easy to use', p: 'Each tool page has a short explanation, a worked example and answers to common questions.' },
];

export const HOME_FAQS = [
  { q: 'What is onlinedevelopertool.com?', a: `onlinedevelopertool.com is a collection of ${TOOLS.length} free, browser-based developer tools for everyday chores: formatting, encoding, decoding, converting, generating, validating and checking.` },
  { q: 'Do I need to sign up?', a: 'No. Open a tool and use it.' },
  { q: 'Is my data uploaded anywhere?', a: 'The tools run in your browser, so what you paste is processed locally. The one thing to know: the Website Status Checker sends a request from your browser to the sites you type in, so those sites will see it.' },
  { q: 'Does the JWT decoder verify the signature?', a: 'No. It splits the token and shows the decoded header and payload. Verifying a signature needs the signing key and should happen on your server.' },
  { q: 'Is Base64 a form of encryption?', a: 'No. Base64 is an encoding that anyone can reverse. It makes data about one third larger and does not protect secrets.' },
  { q: 'Can I edit a JWT online?', a: 'You can read a token with the JWT Decoder, change the claims, and build a new HS256 token from your payload and secret with the JWT Generator. Both run in your browser. Editing a token invalidates its original signature, so a changed token only works where you control the key.' },
  { q: 'Is there an online json_decode?', a: 'json_decode is PHP\'s function for parsing JSON. To see how a JSON string parses, paste it into the JSON Validator or JSON Formatter, which show the parser error or the indented result. The JSON to PHP tool can also draft a class from a sample.' },
  { q: 'Which tools are included?', a: 'JSON tools (format, validate, beautify, minify and convert to C#, TypeScript, Java, Python, Go, PHP and Kotlin), URL/Base64/HTML encoders and decoders, JWT, UUID and hash tools, timestamp, color, number base, regex, diff, query string and cron tools, XML/YAML/CSV converters, text tools and a website status checker.' },
  { q: 'Does it work on a phone or tablet?', a: 'Yes. The layout adapts to small screens, though pasting big payloads is still easier on a keyboard.' },
];

export function getHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: [SITE_DOMAIN, 'Online Developer Tool'],
        url: `${SITE_URL}/`,
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: HOME_TITLE,
        description: HOME_DESC,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        primaryImageOfPage: { '@id': `${SITE_URL}/#primaryimage` },
      },
      {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#primaryimage`,
        url: `${SITE_URL}${OG_IMAGE_PATH}`,
        width: 1200,
        height: 630,
        caption: 'Free online developer tools: JSON formatter, JWT decoder, UUID generator and Base64 tools',
      },
      {
        '@type': 'VideoObject',
        name: 'JSON Formatter demo: format JSON in seconds',
        description: 'A short demo showing messy JSON pasted into the JSON Formatter and returned as clean, indented JSON.',
        thumbnailUrl: `${SITE_URL}/images/json-formatter-demo-poster.webp`,
        contentUrl: `${SITE_URL}/video/json-formatter-demo.mp4`,
        uploadDate: '2026-10-24T10:30:00+05:30',
        duration: 'PT8S',
      },
      {
        '@type': 'FAQPage',
        mainEntity: HOME_FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}

// ------------------------------------------------------- Non-tool pages

export const PAGE_SEO = {
  '/guides': {
    title: 'Developer Guides: JSON, JWT, UUID, Cron and More',
    description: 'Practical developer tutorials with working code: check if a site is down, read UUIDs and JWTs, convert RGB to HEX, fix JSON errors and more.',
    h1: 'Developer Guides',
  },
  '/tools': {
    title: 'All Free Developer Tools - JSON, JWT, Base64, UUID & More',
    description: 'Complete list of free online developer tools: JSON, Base64, URL and HTML encoding, JWT, UUID, hashes, timestamps, regex, cron, diff and more.',
    h1: 'All Developer Tools',
  },
  '/categories': {
    title: 'Developer Tool Categories: JSON, Encoders & More',
    description: 'Browse free developer tools by category: JSON, encoders and decoders, generators and hashes, web tools, text and data tools, and website checking.',
    h1: 'Categories',
  },
  '/about': {
    title: `About ${SITE_NAME} - Free Developer Tools`,
    description: 'Learn how the free, browser-based developer tools on OnlineDeveloperTool work, why they run locally in your browser and what happens to the text you paste.',
    h1: 'About Us',
  },
  '/privacy': {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: 'How the developer tools handle your data: processing runs in your browser, and how advertising cookies from Google AdSense are used.',
    h1: 'Privacy Policy',
  },
  '/terms': {
    title: `Terms of Service | ${SITE_NAME}`,
    description: 'Read the terms for using OnlineDeveloperTool, including permitted use, service limitations, intellectual property, and important information about tool outputs.',
    h1: 'Terms of Service',
  },
  '/contact': {
    title: `Contact Us | ${SITE_NAME}`,
    description: 'Send feedback, report a bug or suggest a new developer tool by email. Tell us which OnlineDeveloperTool page you were using.',
    h1: 'Contact Us',
  },
};

// ------------------------------------------------------ Category pages

for (const c of Object.values(CATEGORY_PAGES)) {
  PAGE_SEO[`/category/${c.slug}`] = {
    title: c.title,
    description: c.description,
    h1: c.h1,
  };
}

export const categoryLink = (category) => {
  const own = categoryPath(category);
  if (own) return own;

  const only = TOOLS.filter((t) => t.category === category);
  return only.length === 1
    ? only[0].path
    : `/tools?category=${encodeURIComponent(category)}`;
};

export function getCategoryByPath(path) {
  const entry = Object.entries(CATEGORY_PAGES).find(
    ([, c]) => `/category/${c.slug}` === path
  );

  return entry ? { category: entry[0], ...entry[1] } : null;
}

export function getGuideJsonLd(guide) {
  const url = canonicalUrl(`/guides/${guide.slug}`);
  const org = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: canonicalUrl('/guides') },
          { '@type': 'ListItem', position: 3, name: guide.h1, item: url },
        ],
      },
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: guide.h1,
        description: guide.description,
        datePublished: GUIDES_UPDATED,
        dateModified: guideDate(guide),
        author: org,
        publisher: org,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        image: DEFAULT_IMAGE,
        inLanguage: 'en',
      },
    ],
  };
}

export function getCategoryJsonLd(category) {
  const c = CATEGORY_PAGES[category];
  const url = canonicalUrl(`/category/${c.slug}`);
  const tools = TOOLS.filter((t) => t.category === category);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Categories', item: canonicalUrl('/categories') },
          { '@type': 'ListItem', position: 3, name: category, item: url },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: c.h1,
        description: c.description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: tools.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t.name,
            url: canonicalUrl(t.path),
          })),
        },
      },
    ],
  };
}

// -------------------------------------------------------------- Tool pages

export const TOOL_SEO = TOOL_SEO_DATA;

export function getRelatedTools(path, group, category) {
  const cfg = TOOL_SEO_DATA[path];

  if (cfg && cfg.related && cfg.related.length) {
    return cfg.related
      .map((p) => TOOLS.find((t) => t.path === p))
      .filter((t) => t && t.path !== path)
      .slice(0, 8);
  }

  const same = (t) =>
    t.path !== path && getToolContent(t.path, t.name)?.group === group;

  const first = TOOLS.filter(same);
  const more = TOOLS.filter(
    (t) => t.path !== path && t.category === category && !first.includes(t)
  );

  return [...first, ...more].slice(0, 6);
}

export function getToolSeo(path, fallbackName, fallbackDesc) {
  const tool = TOOLS.find((t) => t.path === path);
  const name = tool ? tool.name : fallbackName;
  const boost = KEYWORD_BOOST[path];
  const base = getToolContent(path, name);

  const c = base && boost
    ? {
        ...base,
        tasks: [
          ...base.tasks,
          ...(boost.tasks || []).filter(
            (t) => !base.tasks.some((x) => x.toLowerCase() === t.toLowerCase())
          ),
        ],
        faqs: [
          ...base.faqs,
          ...(boost.faqs || [])
            .map(([q, a]) => ({ q, a }))
            .filter((f) => !base.faqs.some((x) => x.q === f.q)),
        ],
      }
    : base;

  const rawCfg = TOOL_SEO_DATA[path];

  const cfg = rawCfg && boost
    ? {
        ...rawCfg,
        ...(boost.t ? { title: boost.t } : {}),
        ...(boost.d ? { description: boost.d } : {}),
        ...(boost.s ? { secondary: boost.s } : {}),
        ...(boost.l ? { longTail: boost.l } : {}),
      }
    : rawCfg;

  const title = cfg ? cfg.title : `${name} Online - Free Browser-Based Tool`;
  const description = cfg ? cfg.description : c ? c.meta : fallbackDesc;
  const h1 = cfg ? cfg.h1 : name;
  const catPath = tool ? categoryPath(tool.category) : null;

  const crumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
  ];

  if (catPath) {
    crumbs.push({
      '@type': 'ListItem',
      position: crumbs.length + 1,
      name: tool.category,
      item: canonicalUrl(catPath),
    });
  }

  crumbs.push({
    '@type': 'ListItem',
    position: crumbs.length + 1,
    name,
    item: canonicalUrl(path),
  });

  const jsonLd = c && {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: crumbs },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl(path)}#webpage`,
        url: canonicalUrl(path),
        name,
        description,
        dateModified: getLastModified(path),
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${canonicalUrl(path)}#application` },
      },
      {
        '@type': 'WebApplication',
        '@id': `${canonicalUrl(path)}#application`,
        name,
        url: canonicalUrl(path),
        description,
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: tool?.category || 'Developer Tool',
        operatingSystem: 'Any (runs in a web browser)',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return {
    tool,
    name,
    content: c,
    title,
    description,
    h1,
    cfg,
    research: SEO_RESEARCH[path] || null,
    categoryPath: catPath,
    jsonLd,
  };
}

// ---------------------------------------------------- Routes for build scripts

export const STATIC_ROUTES = [
  '/',
  '/tools',
  '/categories',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

export const CATEGORY_ROUTES = Object.values(CATEGORY_PAGES).map(
  (c) => `/category/${c.slug}`
);

// Every indexable URL, in sitemap order.
export function getIndexableRoutes() {
  return [
    ...STATIC_ROUTES.slice(0, 3),
    ...CATEGORY_ROUTES,
    ...STATIC_ROUTES.slice(3),
    '/guides',
    ...GUIDE_ROUTES,
    ...TOOLS.map((t) => t.path),
  ];
}

export function getRouteSeo(path) {
  if (path === '/') {
    return {
      kind: 'home',
      title: HOME_TITLE,
      description: HOME_DESC,
      social: HOME_SOCIAL_DESC,
      h1: HOME_H1,
      jsonLd: getHomeJsonLd(),
    };
  }

  const guide = getGuide(path);

  if (guide) {
    return {
      kind: 'guide',
      title: guide.title,
      description: guide.description,
      h1: guide.h1,
      jsonLd: getGuideJsonLd(guide),
      guide,
    };
  }

  const cat = getCategoryByPath(path);

  if (cat) {
    return {
      kind: 'category',
      title: cat.title,
      description: cat.description,
      h1: cat.h1,
      jsonLd: getCategoryJsonLd(cat.category),
      category: cat,
    };
  }

  if (PAGE_SEO[path]) {
    return {
      kind: 'page',
      title: PAGE_SEO[path].title,
      description: PAGE_SEO[path].description,
      h1: PAGE_SEO[path].h1,
      jsonLd: null,
    };
  }

  const t = getToolSeo(path);

  return {
    kind: 'tool',
    title: t.title,
    description: t.description,
    h1: t.h1,
    jsonLd: t.jsonLd,
    tool: t,
  };
}
