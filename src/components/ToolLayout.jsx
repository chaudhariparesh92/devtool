import { Link } from 'react-router-dom';
import SeoHead from './SeoHead';
import AdSlot from './AdSlot';
import { getToolSeo, getRelatedTools } from '../data/seo';
import { getLastModified } from '../data/seo';
import { guidesForTool } from '../data/guides';

// Wraps every tool. The tool itself is rendered untouched as {children};
// this component only adds the page chrome and the supporting content around it.
// Title, description and JSON-LD come from data/seo.js (shared with the prerender script).

export default function ToolLayout({ title, desc, path, children }) {
  const seo = getToolSeo(path, title, desc);
  const { tool, name, content: c, jsonLd, h1, categoryPath: catPath, research } = seo;
  const related = tool && c ? getRelatedTools(path, c.group, tool.category) : [];
  const seoTitle = seo.title;
  const seoDesc = seo.description;

  const guides = guidesForTool(path);
  const h2 = 'h-section mb-3';

  return (
    <article className="space-y-8 min-w-0">
      <SeoHead title={seoTitle} description={seoDesc} url={path} jsonLd={jsonLd} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="crumbs">
        <ol>
          <li><Link to="/" className="a-link">Home</Link></li>
          {tool && catPath && <li><Link to={catPath} className="a-link">{tool.category}</Link></li>}
          <li aria-current="page">{name}</li>
        </ol>
      </nav>

      {/* Title */}
      <header className="space-y-3">
        {tool && <span className="sticker lime">{tool.category}</span>}
        <h1 className="h-display text-4xl sm:text-5xl break-words">{h1}</h1>
        <p className="lede">{c ? c.lede : desc}</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Updated <time dateTime={getLastModified(path)}>{getLastModified(path)}</time></p>
      </header>

      {/* The tool (unchanged component tree) */}
      <section aria-label={`${name} tool`} className="card tool-surface overflow-hidden min-h-[400px]">
        {children}
      </section>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>This tool runs in your browser. No account or signup is required.</p>
      {guides.length > 0 && (
        <p className="text-sm">
          Learn more:{' '}
          {guides.map((g, i) => (
            <span key={g.slug}>{i > 0 && ', '}<Link to={`/guides/${g.slug}`} className="a-link">{g.h1}</Link></span>
          ))}
        </p>
      )}

      {seo.cfg && seo.cfg.longTail && seo.cfg.longTail.length > 0 && (
        <section aria-labelledby="search-tasks-heading" className="card p-5 sm:p-6">
          <h2 id="search-tasks-heading" className={h2}>Common {name} tasks</h2>
          <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
            Developers typically reach for this page when they need to {seo.cfg.longTail.slice(0, 3).join('; ')}.
            The tool is built for quick, practical work rather than a generic demo.
          </p>
        </section>
      )}

      {research && (
        <section aria-labelledby="workflow-heading" className="card p-5 sm:p-6">
          <h2 id="workflow-heading" className={h2}>What matters in a {name.toLowerCase()} workflow</h2>
          <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
            When developers compare online tools for this job, the useful capabilities tend to center on {research.focus}.
            This page keeps those practical needs in mind while linking to related tools when a different workflow is a better fit.
          </p>
        </section>
      )}

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
              <h3 className="code-label">{c.example.inLabel}</h3>
              <pre className="code-block mb-4">{c.example.input}</pre>
              <h3 className="code-label">{c.example.outLabel}</h3>
              <pre className="code-block">{c.example.output}</pre>
            </div>
          </section>

          {/* AD 3: between content sections */}
          <div className="flex justify-center w-full">
            <AdSlot className="w-full max-w-[728px] h-[100px]" slot="YOUR_TOOL_MID_AD_SLOT" />
          </div>

          <section aria-labelledby="features-heading" className="card p-5 sm:p-6">
            <h2 id="features-heading" className={h2}>What you can do with {name}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {c.tasks.map((t) => (
                <li key={t} className="flex gap-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  <span aria-hidden="true">✓</span><span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

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

          {/* In-depth guidance for the highest-value tool pages (data/toolContent.js -> sections) */}
          {c.sections && c.sections.map((sec) => (
            <section key={sec.h} className="card p-5 sm:p-6 space-y-3 min-w-0">
              <h2 className="h-section">{sec.h}</h2>
              {sec.paras && sec.paras.map((t) => <p key={t} className="leading-relaxed" style={{ color: 'var(--muted)' }}>{t}</p>)}
              {sec.list && (
                <ul className="list-disc pl-6 space-y-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {sec.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
              {sec.code && <pre className="code-block">{sec.code}</pre>}
              {sec.links && (
                <p className="text-sm">
                  {sec.linksLabel || 'Related'}:{' '}
                  {sec.links.map(([label, to], i) => (
                    <span key={to}>{i > 0 && ', '}<Link to={to} className="a-link">{label}</Link></span>
                  ))}
                </p>
              )}
            </section>
          ))}

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
              <h2 id="related-heading" className="h-section mb-4">Related Developer Tools</h2>
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
