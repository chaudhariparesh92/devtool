import { Link } from 'react-router-dom';
import SeoHead, { SITE_URL } from './SeoHead';
import AdSlot from './AdSlot';
import { TOOLS } from '../data/tools';
import { getToolContent } from '../data/toolContent';

// Wraps every tool. The tool itself is rendered untouched as {children};
// this component only adds the page chrome and the supporting content around it.
function relatedTools(path, group, category) {
  const same = (t) => t.path !== path && getToolContent(t.path, t.name)?.group === group;
  const first = TOOLS.filter(same);
  const more = TOOLS.filter((t) => t.path !== path && t.category === category && !first.includes(t));
  return [...first, ...more].slice(0, 6);
}

export default function ToolLayout({ title, desc, path, children }) {
  const tool = TOOLS.find((t) => t.path === path);
  const name = tool ? tool.name : title;
  const c = getToolContent(path, name);
  const related = tool && c ? relatedTools(path, c.group, tool.category) : [];

  const seoTitle = `${name} - Free Online Tool | FREE Developer Tool`;
  const seoDesc = c ? c.meta : desc;

  const jsonLd = c && {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          ...(tool ? [{ '@type': 'ListItem', position: 2, name: tool.category, item: `${SITE_URL}/tools?category=${encodeURIComponent(tool.category)}` }] : []),
          { '@type': 'ListItem', position: tool ? 3 : 2, name, item: `${SITE_URL}${path}` },
        ],
      },
      {
        '@type': 'WebApplication',
        name,
        url: `${SITE_URL}${path}`,
        description: seoDesc,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any (runs in a web browser)',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  const h2 = 'h-section mb-3';

  return (
    <article className="space-y-8 min-w-0">
      <SeoHead title={seoTitle} description={seoDesc} url={path} jsonLd={jsonLd} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="crumbs">
        <ol>
          <li><Link to="/" className="a-link">Home</Link></li>
          {tool && <li><Link to={`/tools?category=${encodeURIComponent(tool.category)}`} className="a-link">{tool.category}</Link></li>}
          <li aria-current="page">{name}</li>
        </ol>
      </nav>

      {/* Title */}
      <header className="space-y-3">
        {tool && <span className="sticker lime">{tool.category}</span>}
        <h1 className="h-display text-4xl sm:text-5xl break-words">{name}</h1>
        <p className="lede">{c ? c.lede : desc}</p>
      </header>

      {/* The tool (unchanged component tree) */}
      <section aria-label={`${name} tool`} className="card tool-surface overflow-hidden min-h-[400px]">
        {children}
      </section>

      {/* AD 2: right under the tool, in normal page flow */}
      <div className="flex justify-center w-full">
        <AdSlot className="w-full max-w-[728px] h-[100px]" slot="YOUR_TOOL_BELOW_AD_SLOT" />
      </div>

      {c && (
        <>
          <section aria-labelledby="what-heading" className="grid gap-6 md:grid-cols-2">
            <div className="card p-5 sm:p-6">
              <h2 id="what-heading" className={h2}>What is {name}?</h2>
              <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>{c.what}</p>
            </div>
            <div className="card p-5 sm:p-6">
              <h2 className={h2}>What problem does it solve?</h2>
              <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>{c.problem}</p>
            </div>
          </section>

          <section aria-labelledby="how-heading" className="grid gap-6 lg:grid-cols-2">
            <div className="card p-5 sm:p-6">
              <h2 id="how-heading" className={h2}>How to use {name}</h2>
              <ol className="list-decimal pl-6 space-y-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                {c.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </div>
            <div className="card p-5 sm:p-6 min-w-0">
              <h2 className={h2}>Example</h2>
              <p className="code-label">{c.example.inLabel}</p>
              <pre className="code-block mb-4">{c.example.input}</pre>
              <p className="code-label">{c.example.outLabel}</p>
              <pre className="code-block">{c.example.output}</pre>
            </div>
          </section>

          {/* AD 3: between content sections */}
          <div className="flex justify-center w-full">
            <AdSlot className="w-full max-w-[728px] h-[100px]" slot="YOUR_TOOL_MID_AD_SLOT" />
          </div>

          <section aria-labelledby="use-heading" className="grid gap-6 md:grid-cols-2">
            <div className="card p-5 sm:p-6">
              <h2 id="use-heading" className={h2}>Common use cases</h2>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                {c.useCases.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </div>
            <div className="card p-5 sm:p-6">
              <h2 className={h2}>Related developer tasks</h2>
              <ul className="flex flex-wrap gap-2" aria-label="Related searches">
                {c.tasks.map((t) => <li key={t} className="sticker cyan" style={{ transform: 'none' }}>{t}</li>)}
              </ul>
            </div>
          </section>

          <section aria-labelledby="faq-heading" className="faq">
            <h2 id="faq-heading" className="h-section mb-4">{name} FAQ</h2>
            {c.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p className="faq-a">{f.a}</p>
              </details>
            ))}
          </section>

          {related.length > 0 && (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="h-section mb-4">You might also need</h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <li key={r.path}>
                    <Link to={r.path} className="card card-hover p-4 font-bold">
                      {r.name} <span className="card-arrow" aria-hidden="true">&rarr;</span>
                      <span className="block text-xs font-normal mt-1" style={{ color: 'var(--muted)' }}>{r.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                Looking for something else? <Link to="/tools" className="a-link">Browse all developer tools</Link>.
              </p>
            </section>
          )}
        </>
      )}
    </article>
  );
}
