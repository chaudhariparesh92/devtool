import { Helmet } from 'react-helmet-async';

// Constants live in data/seo.js so the build-time prerender script can share them.
// Re-exported here so existing imports from './SeoHead' keep working.
import { SITE_URL, SITE_NAME, SITE_DOMAIN, DEFAULT_IMAGE } from '../data/seo';
export { SITE_URL, SITE_NAME, SITE_DOMAIN, DEFAULT_IMAGE };

// socialDescription: optional shorter text for og:/twitter: tags (defaults to description).
// noindex: for pages that must not appear in search (e.g. the 404 page); no canonical is emitted.
export default function SeoHead({ title, description, socialDescription, url, jsonLd, image = DEFAULT_IMAGE, imageAlt, noindex = false }) {
  const canonical = url && !noindex ? `${SITE_URL}${url === '/' ? '/' : url}` : null;
  const alt = imageAlt || 'Free online developer tools: JSON formatter, JWT decoder, UUID generator and Base64 tools';
  const social = socialDescription || description;
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
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
