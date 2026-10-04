import { Link } from 'react-router-dom';
import SeoHead, { SITE_URL } from '../components/SeoHead';
import AdSlot from '../components/AdSlot';
import FrustratedDev from '../components/FrustratedDev';
import ToolFinder from '../components/ToolFinder';
import { TOOLS, CATEGORIES, CATEGORY_INFO } from '../data/tools';

// A selection of popular tools to feature on the homepage
const popularTools = [
  { name: 'JSON Formatter', path: '/json-formatter', blurb: 'Pretty-print or inspect messy JSON in one click.' },
  { name: 'JWT Decoder', path: '/jwt-decoder', blurb: 'Read the header and claims inside a token.' },
  { name: 'UUID Generator', path: '/uuid-generator', blurb: 'Make random UUIDs in bulk and copy them.' },
  { name: 'Base64 Decoder', path: '/base64-decoder', blurb: 'Turn Base64 back into readable text.' },
  { name: 'JSON to C#', path: '/json-to-csharp', blurb: 'Draft a C# class from a sample JSON object.' },
  { name: 'Timestamp Converter', path: '/timestamp-converter', blurb: 'Unix time to dates, and back again.' },
];

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

const faqs = [
  { q: 'What is FREE Developer Tool?', a: `A collection of ${TOOLS.length} free, browser-based developer tools for everyday chores: formatting, encoding, decoding, converting, generating, validating and checking.` },
  { q: 'Do I need to sign up?', a: 'No. Open a tool and use it.' },
  { q: 'Is my data uploaded anywhere?', a: 'The tools run in your browser, so what you paste is processed locally. The one thing to know: the Website Status Checker sends a request from your browser to the sites you type in, so those sites will see it.' },
  { q: 'Which tools are included?', a: 'JSON tools (format, validate, minify and convert to C#, TypeScript, Java, Python, Go, PHP and Kotlin), URL/Base64/HTML encoders and decoders, JWT, UUID and hash tools, timestamp, color, number base, regex, diff, query string and cron tools, XML/YAML/CSV converters, text tools and a website status checker.' },
  { q: 'Does it work on a phone or tablet?', a: 'Yes. The layout adapts to small screens, though pasting big payloads is still easier on a keyboard.' },
];

const th = 'text-left';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: 'FREE Developer Tool', url: `${SITE_URL}/` },
      { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return (
    <div className="space-y-16">
      <SeoHead 
        title="FREE Developer Tool - Free Online Tools for JSON, JWT, Base64, UUID & More" 
        description="Stop wasting time on tiny developer tasks. Free, private, browser-based tools to format, encode, decode, convert, generate and validate. No signup." 
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
            Stop wasting time on <span className="marker">tiny developer tasks.</span>
          </h1>
          <p className="lede">
            Need to decode a value, clean up JSON, convert a timestamp or hash a string? Do it here in seconds.
            Free tools for formatting, encoding, decoding, converting, generating, validating and debugging, all in one tab.
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

      {/* AD: in-feed under the hero */}
      <div className="flex justify-center w-full">
         <AdSlot className="w-full max-w-[728px] h-[90px]" slot="YOUR_HOME_IN_FEED_AD_SLOT" />
      </div>

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
        <h2 id="popular-heading" className="h-section">Popular tools</h2>
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
      <div className="flex justify-center w-full">
         <AdSlot className="w-full max-w-[728px] h-[90px]" slot="YOUR_HOME_MID_AD_SLOT" />
      </div>

      {/* ---------------- CATEGORIES ---------------- */}
      <section aria-labelledby="cat-heading" className="space-y-6">
        <h2 id="cat-heading" className="h-section">Browse by what you are trying to do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/tools?category=${encodeURIComponent(c)}`} className="card card-hover p-6">
              <h3 className="text-lg font-black mb-1">{c} <span className="card-arrow" aria-hidden="true">&rarr;</span></h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{CATEGORY_INFO[c]}</p>
            </Link>
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

      {/* ---------------- FAQ ---------------- */}
      <section aria-labelledby="home-faq" className="faq max-w-3xl">
        <h2 id="home-faq" className="h-section mb-4">Questions developers ask</h2>
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p className="faq-a">{f.a}</p>
          </details>
        ))}
      </section>

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
