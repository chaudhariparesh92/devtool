import { CATEGORIES, CATEGORY_INFO, TOOLS } from '../data/tools';
import { SITE_DOMAIN } from './SeoHead';
import { categoryLink } from '../data/seo';

// Helpful reference copy shown just above the footer.
const TIPS = [
  { h: 'JSON', p: 'Keys and strings must use double quotes, and trailing commas and comments are not allowed. Those are the three most common reasons a payload fails to parse.', to: '/json-validator', link: 'Validate JSON' },
  { h: 'JWT', p: 'A JSON Web Token is three Base64URL parts joined by dots: header, payload and signature. Decoding shows the claims but does not prove the token is genuine; only signature verification does.', to: '/jwt-decoder', link: 'Decode a JWT' },
  { h: 'Base64', p: 'Base64 is an encoding, not encryption. Anyone can reverse it, and it makes data roughly one third larger, so never use it to hide secrets.', to: '/base64-decoder', link: 'Decode Base64' },
  { h: 'UUID', p: 'A version 4 UUID is made of random bits and written as 8-4-4-4-12 hexadecimal characters. Collisions are astronomically unlikely, which is why they work well as identifiers.', to: '/uuid-generator', link: 'Generate a UUID' },
  { h: 'Timestamps', p: 'A Unix timestamp counts time since 1 January 1970 UTC. Ten digits usually means seconds and thirteen digits usually means milliseconds.', to: '/timestamp-converter', link: 'Convert a timestamp' },
  { h: 'Hashes', p: 'MD5 is fine for quick checksums but is not safe for security. Prefer SHA-256 or SHA-512, and remember that hashing is one-way and is not encryption.', to: '/sha256-generator', link: 'Create a SHA-256 hash' },
];

export default function FooterSeoContent() {
  return (
    <section
      aria-labelledby="footer-seo-heading"
      className="container mx-auto px-4 max-w-[1100px] mt-12 space-y-8"
    >
      <div className="space-y-3">
        <h2 id="footer-seo-heading" className="h-section">
          About <strong>{SITE_DOMAIN}</strong> and its free developer tools
        </h2>
        <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
          <strong>{SITE_DOMAIN}</strong> is a collection of {TOOLS.length} free, browser-based utilities for the small jobs that
          interrupt real work: formatting a JSON response, decoding a token, converting a timestamp, generating a UUID or
          checking a hash. Each tool has its own page with a short explanation, a worked example and answers to common
          questions, so you can use it and learn what it does at the same time.
        </p>
        <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
          There is no account to create and nothing to install. Tools run in your browser, so the text you paste is
          processed on your own device. The one exception is the Website Status Checker, which sends a request from your
          browser to the address you enter.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <figure className="m-0">
          <img
            src="/images/developer-tools-privacy-browser-only.webp"
            alt="Three steps: paste your input, click the tool, copy the result, all inside your browser"
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
            src="/images/popular-developer-utilities-jwt-uuid-base64.webp"
            alt="Popular developer utilities: JWT decoder, UUID generator, Base64 decoder, SHA-256 hash, regex tester and timestamp converter"
            width="1200"
            height="630"
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-[14px] border-[3px]"
            style={{ borderColor: 'var(--border)' }}
          />
        </figure>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-black">What you can do here</h3>
        <ul className="grid gap-4 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <li key={c} className="card p-5">
              <h4 className="font-black mb-1">
                <a href={categoryLink(c)} className="a-link">{c}</a>
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {CATEGORY_INFO[c]}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-black">Quick developer reference</h3>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((t) => (
            <li key={t.h} className="card p-5 flex flex-col gap-2">
              <h4 className="font-black">{t.h}</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {t.p}
              </p>
              <a href={t.to} className="a-link text-sm mt-auto">{t.link}</a>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
        Missing a tool you need? Visit{' '}
        <a href="/contact" className="a-link">the contact page</a> and tell us what you
        reach for most often. You can also{' '}
        <a href="/tools" className="a-link">browse every tool</a> or read the{' '}
        <a href="/about" className="a-link">About page</a> to see how the site is built and what it does with your data.
      </p>
    </section>
  );
}