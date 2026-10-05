// Single source of truth for SEO metadata.
// Pure data + pure functions (no React) so the same values feed:
//   1. the React pages (SeoHead / ToolLayout / Home), and
//   2. scripts/prerender.mjs, which writes real per-route HTML after `vite build`.
// Nothing here touches tool logic.

import { TOOLS } from './tools.js';
import { getToolContent } from './toolContent.js';

export const SITE_URL = 'https://onlinedevelopertool.com';
export const SITE_NAME = 'OnlineDeveloperTool';
export const SITE_DOMAIN = 'onlinedevelopertool.com';
export const DEFAULT_IMAGE = `${SITE_URL}/images/og-onlinedevelopertool.webp`;

// Bump this when page content genuinely changes. It feeds <lastmod> in sitemap.xml.
export const CONTENT_LAST_MODIFIED = '2026-10-05';

// ---------------------------------------------------------------- Homepage
export const HOME_TITLE = 'Free Online Developer Tools - JSON Formatter, JWT Decoder & More';
export const HOME_DESC =
  'Free online developer tools for JSON formatting, JSON validation, JWT decoding, Base64 encoding and UUID generation. Fast, private and browser-based with no signup required.';
export const HOME_SOCIAL_DESC =
  'Free browser-based developer tools for formatting JSON, validating JSON, decoding JWT, encoding Base64 and generating UUIDs. No signup required.';

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
        alternateName: [SITE_DOMAIN, 'FREE Developer Tool'],
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
        url: `${SITE_URL}/images/onlinedevelopertool-com-free-online-developer-tools.webp`,
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
        uploadDate: '2026-10-04',
        duration: 'PT8S',
      },
      {
        '@type': 'FAQPage',
        mainEntity: HOME_FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
}

// ------------------------------------------------------- Non-tool pages
export const PAGE_SEO = {
  '/tools': {
    title: 'All Free Developer Tools - JSON, JWT, Base64, UUID & More',
    description: 'Complete list of free online developer tools: JSON, Base64, URL and HTML encoding, JWT, UUID, hashes, timestamps, regex, cron, diff and more.',
    h1: 'All Developer Tools',
  },
  '/categories': {
    title: 'Developer Tool Categories - JSON, Encoders, Generators & More',
    description: 'Browse free developer tools by category: JSON, encoders and decoders, generators and hashes, web tools, text and data tools, and website checking.',
    h1: 'Categories',
  },
  '/about': {
    title: `About ${SITE_NAME} - Free Browser-Based Developer Tools`,
    description: 'Learn how the free, browser-based developer tools work, why they run locally in your browser and what happens to the text you paste.',
    h1: 'About Us',
  },
  '/privacy': {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: 'How the developer tools handle your data: processing runs in your browser, and how advertising cookies from Google AdSense are used.',
    h1: 'Privacy Policy',
  },
  '/terms': {
    title: `Terms of Service | ${SITE_NAME}`,
    description: 'The terms and conditions for using the free online developer tools.',
    h1: 'Terms of Service',
  },
  '/contact': {
    title: `Contact Us | ${SITE_NAME}`,
    description: 'Send feedback, report a bug or suggest a new developer tool.',
    h1: 'Contact Us',
  },
};

// -------------------------------------------------------------- Tool pages
// Hand-written titles/descriptions for the highest-value pages.
// Every other tool gets a unique title from its name (see getToolSeo).
export const TOOL_SEO = {
  '/json-formatter': {
    title: 'JSON Formatter Online - Free JSON Beautifier & Validator',
    description: 'Format, beautify and validate JSON online for free. Pretty print JSON, detect syntax errors and make JSON easier to read. No signup required.',
  },
  '/json-validator': {
    title: 'JSON Validator Online - Check JSON Syntax for Free',
    description: 'Validate JSON online for free. Check whether your JSON is valid and see the parser error when it is not. Runs in your browser, no signup required.',
  },
  '/json-beautifier': {
    title: 'JSON Beautifier Online - Pretty Print JSON for Free',
    description: 'Beautify JSON online for free. Turn minified or messy JSON into clean, indented, readable JSON in your browser. No signup required.',
  },
  '/json-minifier': {
    title: 'JSON Minifier Online - Compress JSON to One Line',
    description: 'Minify JSON online for free. Remove whitespace and line breaks to get compact single-line JSON. Runs in your browser, no signup required.',
  },
  '/json-to-csharp': {
    title: 'JSON to C# Converter - Convert JSON to C# Classes Online',
    description: 'Convert JSON to C# classes online for free. Generate C# models from JSON instantly with this browser-based developer tool. No signup required.',
  },
  '/jwt-decoder': {
    title: 'JWT Decoder Online - Decode JSON Web Tokens for Free',
    description: 'Decode JWT tokens online and inspect the header and payload instantly. Free browser-based JWT decoder with no signup required.',
  },
  '/base64-decoder': {
    title: 'Base64 Decoder Online - Decode Base64 Text for Free',
    description: 'Decode Base64 text online for free. Quickly convert Base64 encoded strings back to readable text directly in your browser.',
  },
  '/base64-encoder': {
    title: 'Base64 Encoder Online - Encode Text to Base64 for Free',
    description: 'Encode text to Base64 online for free. Convert plain text, including UTF-8 characters, to a Base64 string directly in your browser.',
  },
  '/uuid-generator': {
    title: 'UUID Generator Online - Generate Random UUIDs for Free',
    description: 'Generate UUIDs online for free. Create random UUID v4 identifiers instantly in your browser with no signup required.',
  },
};

export function getRelatedTools(path, group, category) {
  const same = (t) => t.path !== path && getToolContent(t.path, t.name)?.group === group;
  const first = TOOLS.filter(same);
  const more = TOOLS.filter((t) => t.path !== path && t.category === category && !first.includes(t));
  return [...first, ...more].slice(0, 6);
}

// Returns everything a tool page needs for <head>. `fallbackName` / `fallbackDesc`
// are only used if a path is not listed in data/tools.js or has no content entry.
export function getToolSeo(path, fallbackName, fallbackDesc) {
  const tool = TOOLS.find((t) => t.path === path);
  const name = tool ? tool.name : fallbackName;
  const c = getToolContent(path, name);
  const custom = TOOL_SEO[path];
  const title = custom ? custom.title : `${name} Online - Free Browser-Based Tool`;
  const description = custom ? custom.description : c ? c.meta : fallbackDesc;

  const jsonLd = c && {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          ...(tool ? [{ '@type': 'ListItem', position: 2, name: tool.category, item: `${SITE_URL}/tools?category=${encodeURIComponent(tool.category)}` }] : []),
          { '@type': 'ListItem', position: tool ? 3 : 2, name, item: `${SITE_URL}${path}` },
        ],
      },
      {
        '@type': 'WebApplication',
        name,
        url: `${SITE_URL}${path}`,
        description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any (runs in a web browser)',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return { tool, name, content: c, title, description, jsonLd };
}
