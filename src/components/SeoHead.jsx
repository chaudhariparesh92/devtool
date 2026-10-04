import { Helmet } from 'react-helmet-async';

// Placeholder domain kept from the original project - replace with your real domain.
export const SITE_URL = 'https://yourdomain.com';
export const SITE_NAME = 'FREE Developer Tool';

export default function SeoHead({ title, description, url, jsonLd }) {
  const canonical = url ? `${SITE_URL}${url}` : null;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
