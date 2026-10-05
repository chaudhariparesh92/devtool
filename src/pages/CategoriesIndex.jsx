import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { CATEGORIES, CATEGORY_INFO, TOOLS } from '../data/tools';
import { PAGE_SEO, categoryLink } from '../data/seo';

export default function CategoriesIndex() {
  return (
    <div className="space-y-8">
      <SeoHead
        title={PAGE_SEO['/categories'].title}
        description={PAGE_SEO['/categories'].description}
        url="/categories"
      />
      <header className="space-y-3">
        <span className="sticker pink">Browse</span>
        <h1 className="h-display text-4xl sm:text-5xl">Categories</h1>
        <p className="lede">Pick the kind of chore you are facing. Every category links to working, browser-based tools.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((c) => {
          const inCat = TOOLS.filter((t) => t.category === c);
          return (
            <section key={c} className="card p-6 min-w-0">
              <h2 className="text-2xl font-black mb-1">{c}</h2>
              <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>{CATEGORY_INFO[c]}</p>
              <ul className="flex flex-wrap gap-2 mb-4">
                {inCat.slice(0, 6).map((t) => (
                  <li key={t.path}><Link to={t.path} className="a-link text-sm">{t.name}</Link></li>
                ))}
                {inCat.length > 6 && <li className="text-sm" style={{ color: 'var(--muted)' }}>+{inCat.length - 6} more</li>}
              </ul>
              <Link
                to={categoryLink(c)}
                className="btn btn-ghost !py-2 !px-4 !text-sm"
              >
                View {c} ({inCat.length}) <span aria-hidden="true">&rarr;</span>
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}
