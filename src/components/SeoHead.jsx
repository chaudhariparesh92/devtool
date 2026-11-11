import { Helmet } from 'react-helmet-async';

// Constants live in data/seo.js so the build-time prerender script can share them.
// Re-exported here so existing imports from './SeoHead' keep working.
import { SITE_URL, SITE_NAME, SITE_DOMAIN, DEFAULT_IMAGE } from '../data/seo';
export { SITE_URL, SITE_NAME, SITE_DOMAIN, DEFAULT_IMAGE };

// socialDescription: optional shorter text for og:/twitter: tags (defaults to description).
// noindex: for pages that must not appear in search (e.g. the 404 page); no canonical is emitted.
function normalizeCanonicalPath(value) {
  if (!value || typeof value !== 'string') return null;
  // Canonicals describe the page, not tracking/query variants or in-page fragments.
  // Always use a trailing slash for non-root paths so they match prerender output,
  // the sitemap, and Cloudflare's directory-style serving (/path/index.html → /path/).
  let path = value.trim();
  try {
    if (/^https?:\/\//i.test(path)) {
      const parsed = new URL(path);
      if (parsed.origin !== SITE_URL) return null;
      path = parsed.pathname;
    }
  } catch {
    return null;
  }
  path = `/${path}`.replace(/\/{2,}/g, '/').split(/[?#]/, 1)[0];
  if (path.length > 1) {
    path = path.replace(/\/+$/, '') + '/';
  }
  return path || '/';
}

export default function SeoHead({ title, description, socialDescription, url, jsonLd, image = DEFAULT_IMAGE, imageAlt, noindex = false }) {
  const canonicalPath = normalizeCanonicalPath(url);
  const canonical = canonicalPath && !noindex ? `${SITE_URL}${canonicalPath}` : null;
  const alt = imageAlt || 'Free online developer tools: JSON formatter, JWT decoder, UUID generator and Base64 tools';
  const social = socialDescription || description;

  // Keep a valid page-level schema on indexable routes even when a page does not
  // need a specialized schema. Tool and category pages pass their richer JSON-LD.
  // This is metadata only; it does not change routing or tool behavior.
  const resolvedJsonLd = jsonLd || (canonical && !noindex ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    inLanguage: 'en',
  } : null);

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={social} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {canonical && <meta name="twitter:url" content={canonical} />}
      <meta name="twitter:description" content={social} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={alt} />
      {resolvedJsonLd && <script type="application/ld+json">{JSON.stringify(resolvedJsonLd)}</script>}
    </Helmet>
  );
}
