import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { TOOLS } from '../data/tools';
import { GUIDES, getGuide, GUIDES_UPDATED } from '../data/guides';
import { getGuideJsonLd } from '../data/seo';

// /guides/<slug>: one tutorial. Everything comes from data/guides.js (shared with the prerender script).
export default function GuidePage({ path }) {
  const g = getGuide(path);
  if (!g) return null;
  const tool = TOOLS.find((t) => t.path === g.tool);
  const related = g.related.map((p) => TOOLS.find((t) => t.path === p)).filter(Boolean);
  const more = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 4);

  return (
    <article className="space-y-8 min-w-0">
      <SeoHead title={g.title} description={g.description} url={path} jsonLd={getGuideJsonLd(g)} />

      <nav aria-label="Breadcrumb" className="crumbs">
        <ol>
          <li><Link to="/" className="a-link">Home</Link></li>
          <li><Link to="/guides" className="a-link">Guides</Link></li>
          <li aria-current="page">{g.h1}</li>
        </ol>
      </nav>

      <header className="space-y-3">
        <span className="sticker lime">Guide</span>
        <h1 className="h-display text-4xl sm:text-5xl break-words">{g.h1}</h1>
        <p className="lede">{g.lede}</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Updated <time dateTime={GUIDES_UPDATED}>{GUIDES_UPDATED}</time></p>
      </header>

      {tool && (
        <p className="card p-4 sm:p-5">
          Try it now: <Link to={tool.path} className="a-link font-bold">{g.toolName || tool.name}</Link>. It runs in your browser, with no signup.
        </p>
      )}

      {g.sections.map((sec) => (
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

      <section aria-labelledby="guide-faq-heading" className="faq">
        <h2 id="guide-faq-heading" className="h-section mb-4">Frequently asked questions</h2>
        {g.faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p className="faq-a">{f.a}</p>
          </details>
        ))}
      </section>

      <section aria-labelledby="guide-tools-heading" className="card p-5 sm:p-6 space-y-3">
        <h2 id="guide-tools-heading" className="h-section">Tools used in this guide</h2>
        <ul className="flex flex-wrap gap-2">
          {tool && <li><Link to={tool.path} className="sticker lime" style={{ transform: 'none' }}>{tool.name}</Link></li>}
          {related.map((t) => <li key={t.path}><Link to={t.path} className="sticker cyan" style={{ transform: 'none' }}>{t.name}</Link></li>)}
        </ul>
      </section>

      <section aria-labelledby="more-guides-heading">
        <h2 id="more-guides-heading" className="h-section mb-3">More guides</h2>
        <ul className="flex flex-wrap gap-2">
          {more.map((x) => <li key={x.slug}><Link to={`/guides/${x.slug}`} className="sticker pink" style={{ transform: 'none' }}>{x.h1}</Link></li>)}
          <li><Link to="/guides" className="sticker cyan" style={{ transform: 'none' }}>All guides</Link></li>
        </ul>
      </section>
    </article>
  );
}
