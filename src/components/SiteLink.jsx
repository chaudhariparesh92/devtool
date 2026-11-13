import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Every indexable page is served and canonicalised WITH a trailing slash
// (https://onlinedevelopertool.com/json-formatter/). Internal links used to point at the
// slash-less form, which has to be 301-redirected before Google reaches the canonical page.
// This wrapper writes the canonical form straight into the href, so crawlers and visitors
// land on the canonical URL without a redirect hop. Query strings and #fragments are kept.

export function withTrailingSlash(to) {
  if (typeof to !== 'string') return to;
  if (!to.startsWith('/') || to.startsWith('//')) return to;
  const i = to.search(/[?#]/);
  const path = i === -1 ? to : to.slice(0, i);
  const rest = i === -1 ? '' : to.slice(i);
  if (path.length <= 1 || path.endsWith('/')) return to;
  // Leave real files (sitemap.xml, images, etc.) alone.
  if (/\.[a-z0-9]{2,8}$/i.test(path)) return to;
  return `${path}/${rest}`;
}

// Strip the trailing slash so pathname comparisons work for both /tools and /tools/.
export function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

const SiteLink = forwardRef(function SiteLink({ to, ...props }, ref) {
  return <RouterLink ref={ref} to={withTrailingSlash(to)} {...props} />;
});

export default SiteLink;
