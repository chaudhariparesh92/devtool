import { Helmet } from 'react-helmet-async';

// Production domain (was the placeholder https://yourdomain.com).
// Canonical, og:url and every JSON-LD "url" are built from this one constant.
export const SITE_URL = 'https://onlinedevelopertool.com';
export const SITE_NAME = 'FREE Developer Tool';
export const SITE_DOMAIN = 'onlinedevelopertool.com/';
export const DEFAULT_IMAGE = `${SITE_URL}/images/og-onlinedevelopertool.webp`;

export default function SeoHead({ title, description, url, jsonLd, image = DEFAULT_IMAGE, imageAlt }) {
  const canonical = url ? `${SITE_URL}${url === '/' ? '/' : url}` : null;
  const alt = imageAlt || `${SITE_NAME} - free online developer tools`;
  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={alt} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
