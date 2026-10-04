import { Link, useLocation } from 'react-router-dom';
import { Terminal, ArrowUp } from 'lucide-react';
import { CATEGORIES } from '../data/tools';

const POPULAR = [
  { name: 'JSON Formatter', path: '/json-formatter' },
  { name: 'JWT Decoder', path: '/jwt-decoder' },
  { name: 'UUID Generator', path: '/uuid-generator' },
  { name: 'Base64 Decoder', path: '/base64-decoder' },
  { name: 'JSON to C#', path: '/json-to-csharp' },
  { name: 'Timestamp Converter', path: '/timestamp-converter' },
  { name: 'Website Status Checker', path: '/website-status-checker' },
];

const SITE_LINKS = [
  { name: 'All Tools', path: '/tools' },
  { name: 'Browse Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Privacy', path: '/privacy' },
  { name: 'Terms', path: '/terms' },
  { name: 'Contact', path: '/contact' },
];

const colHead = 'text-sm font-black uppercase tracking-wider mb-3';

export default function Footer() {
  const { pathname } = useLocation();

  // Same pill style as the header nav; the current page is highlighted.
  const FooterLink = ({ to, children }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className={`nav-link !text-sm !px-3 !py-1 ${active ? 'is-active' : ''}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <footer className="mt-12 border-t-[3px] bg-[var(--surface)]" style={{ borderColor: 'var(--border)' }}>
      <div className="container mx-auto px-4 py-10 max-w-[1400px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 min-w-0">
            <Link to="/" className="brand" aria-label="FREE Developer Tool - home">
              <span className="brand-mark"><Terminal size={20} strokeWidth={3} /></span>
              <span className="brand-text">
                <span className="brand-free">FREE</span>Developer Tool
              </span>
            </Link>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Small developer chores, done in seconds. Format, encode, decode, convert, generate and check things without hunting through ten tabs.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="sticker lime">100% Free</span>
              <span className="sticker cyan">No signup</span>
            </div>
            <p className="font-code text-xs" style={{ color: 'var(--muted)' }}>
              $ git blame --me <span className="cursor-blink" />
            </p>
          </div>

          <nav aria-label="Popular tools">
            <h2 className={colHead}>Popular Tools</h2>
            <ul className="flex flex-col items-start gap-1">
              {POPULAR.map((t) => (
                <li key={t.path}><FooterLink to={t.path}>{t.name}</FooterLink></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Tool categories">
            <h2 className={colHead}>Developer Tools</h2>
            <ul className="flex flex-col items-start gap-1">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    to={`/tools?category=${encodeURIComponent(c)}`}
                    className="nav-link !text-sm !px-3 !py-1"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site links">
            <h2 className={colHead}>Resources &amp; Site</h2>
            <ul className="flex flex-col items-start gap-1">
              {SITE_LINKS.map((l) => (
                <li key={l.path}><FooterLink to={l.path}>{l.name}</FooterLink></li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className="mt-10 pt-6 border-t-2 border-dashed text-sm flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <div className="space-y-1">
            <p>
              &copy; {new Date().getFullYear()} <strong style={{ color: 'var(--ink)' }}>DevTransition</strong>. All rights reserved.
            </p>
            <p className="text-xs">
              FREE Developer Tool is built and maintained by DevTransition. Your input is processed locally in your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn btn-ghost !py-2 !px-4 !text-sm"
          >
            <ArrowUp size={16} strokeWidth={3} aria-hidden="true" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}