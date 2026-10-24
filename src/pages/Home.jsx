import { Link } from 'react-router-dom';
import SeoHead, { SITE_URL, SITE_DOMAIN } from '../components/SeoHead';
import VideoEmbed from '../components/VideoEmbed';
import AdSlot from '../components/AdSlot';
import FrustratedDev from '../components/FrustratedDev';
import ToolFinder from '../components/ToolFinder';
import { TOOLS, CATEGORIES, CATEGORY_INFO } from '../data/tools';
import { HOME_TITLE, HOME_DESC, HOME_SOCIAL_DESC, HOME_POPULAR, HOME_LINK_GROUPS, HOME_WHY, HOME_FAQS, getHomeJsonLd, categoryLink } from '../data/seo';

// Popular tools, FAQs and link groups live in data/seo.js (shared with the prerender script).
const popularTools = HOME_POPULAR;

// Real pains -> real tools that exist in src/data/tools.js
const pains = [
  { pain: 'Squinting at a one-line JSON blob', fix: [['JSON Formatter', '/json-formatter'], ['JSON Validator', '/json-validator']] },
  { pain: 'Converting timestamps in your head', fix: [['Timestamp Converter', '/timestamp-converter'], ['Unix Timestamp', '/unix-timestamp']] },
  { pain: 'Encoding and decoding values by hand', fix: [['Base64 Decoder', '/base64-decoder'], ['URL Decoder', '/url-decoder']] },
  { pain: 'Wondering if that XML is even valid', fix: [['XML Validator', '/xml-validator'], ['YAML to JSON', '/yaml-to-json']] },
  { pain: 'Needing a hash or a UUID right now', fix: [['SHA-256 Generator', '/sha256-generator'], ['UUID Generator', '/uuid-generator']] },
  { pain: 'Converting hex, binary and colors', fix: [['Number Base Converter', '/number-base-converter'], ['HEX to RGB', '/hex-to-rgb']] },
  { pain: 'Cleaning strings and making slugs', fix: [['Case Converter', '/case-converter'], ['Text to Slug', '/text-to-slug']] },
  { pain: 'Debugging the small stuff', fix: [['Diff Checker', '/diff-checker'], ['Regex Tester', '/regex-tester'], ['Website Status Checker', '/website-status-checker']] },
];

const faqs = HOME_FAQS;

const th = 'text-left';

const HOME_IN_FEED_AD_SLOT = 'YOUR_HOME_IN_FEED_AD_SLOT';
const HOME_MID_AD_SLOT = 'YOUR_HOME_MID_AD_SLOT';
const HOME_FAQ_SIDE_AD_SLOT = 'YOUR_HOME_FAQ_SIDE_AD_SLOT';
const isConfiguredAdSlot = (slot) => /^\d+$/.test(String(slot || '').trim());

export default function Home() {
  const jsonLd = getHomeJsonLd();

  return (
    <div className="space-y-16">
      <SeoHead 
        title={HOME_TITLE}
        description={HOME_DESC}
        socialDescription={HOME_SOCIAL_DESC}
        image={`${SITE_URL}/images/og-onlinedevelopertool.webp`}
        imageAlt="Free Online Developer Tools"
        url="/" 
        jsonLd={jsonLd}
      />
      
      {/* ---------------- HERO ---------------- */}
      <section aria-labelledby="hero-heading" className="grid lg:grid-cols-2 gap-10 items-center pt-4">
        <div className="space-y-6 min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="sticker lime">No signup</span>
            <span className="sticker pink">Runs in your browser</span>
            <span className="sticker cyan">{TOOLS.length} tools</span>
          </div>
          <h1 id="hero-heading" className="h-display text-5xl sm:text-6xl xl:text-7xl break-words">
            Free Online <span className="marker">Developer Tools</span>
          </h1>
          <p className="h-section">Stop wasting time on tiny developer tasks.</p>
          <p className="lede">
            Free browser-based tools for developers including JSON Formatter, JSON Validator, JWT Decoder, Base64 Encoder and UUID Generator.
            Format JSON, decode a token, convert a timestamp or generate a UUID in seconds at{' '}
            <b>{SITE_DOMAIN}</b>, with no signup required.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/tools" className="btn btn-primary">Explore Free Developer Tools <span aria-hidden="true">&rarr;</span></Link>
            <a href="#find-a-tool" className="btn btn-ghost">Find a Tool</a>
          </div>
          <p className="font-code text-sm" style={{ color: 'var(--muted)' }}>
            $ paste &rarr; click &rarr; copy <span className="cursor-blink" />
          </p>
        </div>
        <FrustratedDev />
      </section>

      {/* AD: in-feed under the hero. Do not render an empty wrapper for placeholder slots. */}
      {isConfiguredAdSlot(HOME_IN_FEED_AD_SLOT) && (
        <div className="flex justify-center w-full">
          <AdSlot className="w-full max-w-[728px] h-[90px]" slot={HOME_IN_FEED_AD_SLOT} />
        </div>
      )}

      {/* ---------------- PROBLEM -> SOLUTION ---------------- */}
      <section aria-labelledby="problem-heading" className="space-y-6">
        <div className="space-y-2">
          <span className="sticker">The problem</span>
          <h2 id="problem-heading" className="h-section">Developers lose hours to repetitive little chores.</h2>
          <p className="lede">Each one takes two minutes. Together they eat your afternoon. Here is the usual list, and the tool that handles it.</p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pains.map((p) => (
            <li key={p.pain} className="card p-5 flex flex-col gap-3">
              <p className="font-black leading-snug">{p.pain}</p>
              <ul className="space-y-1 mt-auto">
                {p.fix.map(([label, to]) => (
                  <li key={to}><Link to={to} className="a-link text-sm">{label}</Link></li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="card p-6 text-center" style={{ background: 'var(--surface-2)' }}>
          <p className="h-section">One place. <span className="glow-text">Free developer tools.</span></p>
          <p className="mt-2" style={{ color: 'var(--muted)' }}>No ten-tab scavenger hunt, no ad-ridden converter you will never find again.</p>
        </div>
      </section>

      {/* ---------------- FINDER ---------------- */}
      <section id="find-a-tool" aria-label="Find a tool" className="max-w-3xl mx-auto w-full">
        <ToolFinder />
      </section>

      {/* ---------------- POPULAR ---------------- */}
      <section aria-labelledby="popular-heading" className="space-y-6">
        <h2 id="popular-heading" className="h-section">Popular Developer Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map(tool => (
            <Link key={tool.path} to={tool.path} className="card card-hover p-6">
              <h3 className="text-xl font-black mb-2">
                {tool.name} <span className="card-arrow" aria-hidden="true">&rarr;</span>
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{tool.blurb}</p>
            </Link>
          ))}
        </div>
        <div>
          <Link to="/tools" className="btn btn-pink">View All {TOOLS.length} Tools <span aria-hidden="true">&rarr;</span></Link>
        </div>
      </section>

      {/* AD: between content sections */}
      {isConfiguredAdSlot(HOME_MID_AD_SLOT) && (
        <div className="flex justify-center w-full">
          <AdSlot className="w-full max-w-[728px] h-[90px]" slot={HOME_MID_AD_SLOT} />
        </div>
      )}

      {/* ---------------- CATEGORIES ---------------- */}
      <section aria-labelledby="cat-heading" className="space-y-6">
        <h2 id="cat-heading" className="h-section">Browse by what you are trying to do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <Link key={c} to={categoryLink(c)} className="card card-hover p-6">
              <h3 className="text-lg font-black mb-1">{c} <span className="card-arrow" aria-hidden="true">&rarr;</span></h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{CATEGORY_INFO[c]}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- JSON / JWT / ENCODING: direct links to tool pages ---------------- */}
      <section aria-labelledby="groups-heading" className="space-y-6">
        <h2 id="groups-heading" className="h-section">JSON, JWT and encoding tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOME_LINK_GROUPS.map((g) => (
            <div key={g.h} className="card p-6 min-w-0">
              <h3 className="text-lg font-black mb-1">{g.h}</h3>
              <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>{g.p}</p>
              <ul className="space-y-1">
                {g.links.map(([label, to]) => (
                  <li key={to}><Link to={to} className="a-link text-sm">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CHEATSHEET ---------------- */}
      <section aria-labelledby="cheat-heading" className="space-y-6">
        <div className="space-y-2">
          <span className="sticker pink">Cheatsheet</span>
          <h2 id="cheat-heading" className="h-section">Quick reference for the things you keep forgetting</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="min-w-0">
            <h3 className="font-black mb-2">HTTP status codes</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th className={th}>Code</th><th className={th}>Meaning</th></tr></thead>
                <tbody>
                  <tr><td className="font-code">200</td><td>OK</td></tr>
                  <tr><td className="font-code">301</td><td>Moved permanently (redirect)</td></tr>
                  <tr><td className="font-code">401</td><td>Unauthorized (no or bad credentials)</td></tr>
                  <tr><td className="font-code">403</td><td>Forbidden</td></tr>
                  <tr><td className="font-code">404</td><td>Not found</td></tr>
                  <tr><td className="font-code">500</td><td>Server error</td></tr>
                  <tr><td className="font-code">503</td><td>Service unavailable</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-2">Check a live site with the <Link to="/website-status-checker" className="a-link">Website Status Checker</Link>.</p>
          </div>
          <div className="min-w-0">
            <h3 className="font-black mb-2">Common cron schedules</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th className={th}>Expression</th><th className={th}>Runs</th></tr></thead>
                <tbody>
                  <tr><td className="font-code">*/5 * * * *</td><td>Every 5 minutes</td></tr>
                  <tr><td className="font-code">*/15 * * * *</td><td>Every 15 minutes</td></tr>
                  <tr><td className="font-code">0 * * * *</td><td>At the start of every hour</td></tr>
                  <tr><td className="font-code">0 0 * * *</td><td>Every day at midnight</td></tr>
                  <tr><td className="font-code">0 9 * * 1-5</td><td>9:00 on weekdays</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-2">Try your own in the <Link to="/cron-expression-parser" className="a-link">Cron Expression Parser</Link>.</p>
          </div>
          <div className="min-w-0">
            <h3 className="font-black mb-2">Same number, different bases</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th className={th}>Decimal</th><th className={th}>Binary</th><th className={th}>Hex</th></tr></thead>
                <tbody>
                  <tr><td className="font-code">10</td><td className="font-code">1010</td><td className="font-code">A</td></tr>
                  <tr><td className="font-code">16</td><td className="font-code">10000</td><td className="font-code">10</td></tr>
                  <tr><td className="font-code">100</td><td className="font-code">1100100</td><td className="font-code">64</td></tr>
                  <tr><td className="font-code">255</td><td className="font-code">11111111</td><td className="font-code">FF</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-2">Convert any value with the <Link to="/number-base-converter" className="a-link">Number Base Converter</Link>.</p>
          </div>
        </div>
      </section>

      {/* ---------------- SEE IT IN ACTION: video + images ---------------- */}
      <section aria-labelledby="demo-heading" className="space-y-6">
        <div className="space-y-2">
          <span className="sticker cyan">Watch</span>
          <h2 id="demo-heading" className="h-section">See a tool in action: format JSON in seconds</h2>
          <p className="lede">
            This 8-second demo shows the workflow every tool follows: paste, click, copy.
          </p>
        </div>
        <VideoEmbed
          src="/video/json-formatter-demo.mp4"
          poster="/images/json-formatter-demo-poster.webp"
          title="JSON Formatter demo video"
          caption="Demo: a one-line JSON object is pasted, processed and returned as readable, indented JSON."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <figure className="m-0">
            <img
              src="/images/onlinedevelopertool-com-free-online-developer-tools.webp"
              alt="Free online developer tools: JSON formatter, JWT decoder, UUID generator and Base64 utilities"
              width="1200"
              height="630"
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-[14px] border-[3px]"
              style={{ borderColor: 'var(--border)' }}
            />
          </figure>
          <figure className="m-0">
            <img
              src="/images/json-formatter-online-before-after.webp"
              alt="JSON Formatter before and after: minified JSON on the left, readable indented JSON on the right"
              width="1200"
              height="630"
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-[14px] border-[3px]"
              style={{ borderColor: 'var(--border)' }}
            />
          </figure>
        </div>
      </section>

      {/* ---------------- WHY ---------------- */}
      <section aria-labelledby="why-heading" className="space-y-6">
        <h2 id="why-heading" className="h-section">Why use our developer tools?</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOME_WHY.map((w) => (
            <li key={w.h} className="card p-5">
              <h3 className="font-black mb-1">{w.h}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{w.p}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <div className={`grid gap-8 ${isConfiguredAdSlot(HOME_FAQ_SIDE_AD_SLOT) ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : 'grid-cols-1'} items-start`}>
        <section aria-labelledby="home-faq" className="faq min-w-0">
          <h2 id="home-faq" className="h-section mb-4">Questions developers ask</h2>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="faq-a">{f.a}</p>
            </details>
          ))}
        </section>

        {/* AD: reserve a column only when a real numeric slot is configured. */}
        {isConfiguredAdSlot(HOME_FAQ_SIDE_AD_SLOT) && (
          <div className="flex justify-center w-full lg:pt-12">
            <AdSlot className="w-full max-w-[300px] h-[250px]" slot={HOME_FAQ_SIDE_AD_SLOT} />
          </div>
        )}
      </div>

      {/* ---------------- CTA ---------------- */}
      <section className="card p-8 text-center space-y-4" style={{ background: 'var(--surface-2)' }}>
        <h2 className="h-section">Got a tiny task? Get it done.</h2>
        <p className="lede mx-auto">Pick a tool, paste your input, copy the result. Back to the real work.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/tools" className="btn btn-primary">Explore Free Developer Tools <span aria-hidden="true">&rarr;</span></Link>
          <Link to="/categories" className="btn btn-ghost">Browse categories</Link>
        </div>
      </section>
    </div>
  );
}
