import { Helmet } from 'react-helmet-async';
export default function SeoHead({ title, description, url }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={`https://yourdomain.com${url}`} />}
    </Helmet>
  );
}