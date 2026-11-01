import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { TOOLS } from '../data/tools';
import { GUIDES } from '../data/guides';
import { PAGE_SEO } from '../data/seo';

// /guides: index of tutorials. Content comes from data/guides.js so the prerender script writes it into static HTML.
export default function GuidesIndex({ path = '/guides' }) {
  const seo = PAGE_SEO['/guides'];
  return (
    <div className="space-y-10 min-w-0">
      <SeoHead title={seo.title} description={seo.description} url={path} />

      <nav aria-label="Breadcrumb" className="crumbs">
        <ol>
          <li><Link to="/" className="a-link">Home</Link></li>
          <li aria-current="page">Guides</li>
        </ol>
      </nav>

      <header className="space-y-3">
        <span className="sticker lime">{GUIDES.length} guides</span>
        <h1 className="h-display text-4xl sm:text-5xl break-words">{seo.h1}</h1>
        <p className="lede">Short, practical tutorials with working code for the jobs the tools handle: checking a site, reading a UUID or JWT, converting colours and numbers, and fixing JSON.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => {
          const tool = TOOLS.find((t) => t.path === g.tool);
          return (
            <li key={g.slug}>
              <Link to={`/guides/${g.slug}`} className="card card-hover p-5 block h-full">
                <span className="block font-bold text-lg">{g.h1} <span className="card-arrow" aria-hidden="true">&rarr;</span></span>
                <span className="block text-sm mt-2" style={{ color: 'var(--muted)' }}>{g.lede}</span>
                {tool && <span className="block text-xs mt-3" style={{ color: 'var(--muted)' }}>Tool: {tool.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
