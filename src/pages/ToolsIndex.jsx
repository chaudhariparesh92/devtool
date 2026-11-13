import { useSearchParams } from 'react-router-dom';
import Link from '../components/SiteLink';
import SeoHead from '../components/SeoHead';
import { TOOLS, CATEGORIES, CATEGORY_INFO } from '../data/tools';
import { PAGE_SEO } from '../data/seo';
import { categoryPath } from '../data/categoryContent';

const ToolLink = ({ r }) => (
  <Link to={r.path} className="card card-hover p-4 font-bold truncate">
    {r.name} <span className="card-arrow" aria-hidden="true">&rarr;</span>
  </Link>
);

export default function ToolsIndex() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  // Apply category filter if it exists in the URL
  const displayRoutes = categoryFilter
    ? TOOLS.filter(t => t.category === categoryFilter)
    : TOOLS;

  return (
    <div className="space-y-8">
      <SeoHead 
        title={categoryFilter ? `${categoryFilter} - Free Online Developer Tools` : PAGE_SEO['/tools'].title} 
        description={categoryFilter && CATEGORY_INFO[categoryFilter] ? CATEGORY_INFO[categoryFilter] : PAGE_SEO['/tools'].description} 
        url={categoryFilter && categoryPath(categoryFilter) ? categoryPath(categoryFilter) : '/tools'} 
      />
      
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
         <div className="space-y-3">
           <span className="sticker lime">{displayRoutes.length} tools</span>
           <h1 className="h-display text-4xl sm:text-5xl">{categoryFilter ? categoryFilter : "All Developer Tools"}</h1>
           <p className="lede">
             {categoryFilter ? (CATEGORY_INFO[categoryFilter] || `Showing tools for ${categoryFilter}.`) : "Select a tool to get started. Everything runs in your browser."}
           </p>
         </div>
         {categoryFilter && (
           <Link to="/tools" className="btn btn-ghost !py-2 !px-4 !text-sm self-start">
             Clear Filter
           </Link>
         )}
      </header>
      
      {displayRoutes.length === 0 ? (
         <div className="card p-12 text-center">
            No tools found for this category.
         </div>
      ) : categoryFilter ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           {displayRoutes.map(r => <ToolLink key={r.path} r={r} />)}
         </div>
      ) : (
         <div className="space-y-10">
           {CATEGORIES.map((c) => {
             const list = displayRoutes.filter((t) => t.category === c);
             if (list.length === 0) return null;
             return (
               <section key={c} aria-labelledby={`cat-${c}`}>
                 <h2 id={`cat-${c}`} className="h-section mb-1">{c}</h2>
                 <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{CATEGORY_INFO[c]}</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {list.map(r => <ToolLink key={r.path} r={r} />)}
                 </div>
               </section>
             );
           })}
         </div>
      )}
    </div>
  );
}
