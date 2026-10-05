import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { TOOLS, CATEGORIES } from '../data/tools';
import { getToolContent } from '../data/toolContent';
import { getCategoryByPath, getCategoryJsonLd, categoryLink } from '../data/seo';

// /category/<slug> landing page. Everything on it comes from data/categoryContent.js and
// data/tools.js, so the prerender script can write the same content into static HTML.
export default function CategoryPage({ path }) {
  const cat = getCategoryByPath(path);
  if (!cat) return null;
  const tools = TOOLS.filter((t) => t.category === cat.category);
  const others = CATEGORIES.filter((c) => c !== cat.category);

  return (
    <div className="space-y-10 min-w-0">
      <SeoHead title={cat.title} description={cat.description} url={path} jsonLd={getCategoryJsonLd(cat.category)} />

      <nav aria-label="Breadcrumb" className="crumbs">
        <ol>
          <li><Link to="/" className="a-link">Home</Link></li>
          <li><Link to="/categories" className="a-link">Categories</Link></li>
          <li aria-current="page">{cat.category}</li>
        </ol>
      </nav>

      <header className="space-y-3">
        <span className="sticker lime">{tools.length} tools</span>
        <h1 className="h-display text-4xl sm:text-5xl break-words">{cat.h1}</h1>
        {cat.intro.map((p) => (
          <p key={p} className="lede">{p}</p>
        ))}
      </header>

      <section aria-labelledby="guide-heading" className="card p-5 sm:p-6 space-y-4">
        <h2 id="guide-heading" className="h-section">Which {cat.category.toLowerCase()} tool do you need?</h2>
        <ul className="space-y-3">
          {cat.guide.map((g) => (
            <li key={g.need} className="leading-relaxed" style={{ color: 'var(--muted)' }}>
              <strong>{g.need}:</strong>{' '}
              <Link to={g.to} className="a-link">{TOOLS.find((t) => t.path === g.to)?.name}</Link>. {g.text}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="all-tools-heading">
        <h2 id="all-tools-heading" className="h-section mb-4">All {cat.category.toLowerCase()}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {tools.map((t) => {
            const c = getToolContent(t.path, t.name);
            return (
              <li key={t.path}>
                <Link to={t.path} className="card card-hover p-4 block font-bold">
                  {t.name} <span className="card-arrow" aria-hidden="true">&rarr;</span>
                  {c && <span className="block text-sm font-normal mt-1" style={{ color: 'var(--muted)' }}>{c.lede}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="more-cats-heading">
        <h2 id="more-cats-heading" className="h-section mb-3">More developer tool categories</h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((c) => (
            <li key={c}><Link to={categoryLink(c)} className="sticker cyan" style={{ transform: 'none' }}>{c}</Link></li>
          ))}
          <li><Link to="/tools" className="sticker pink" style={{ transform: 'none' }}>All developer tools</Link></li>
        </ul>
      </section>
    </div>
  );
}
