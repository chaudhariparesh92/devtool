import { useLocation } from 'react-router-dom';
import Link, { normalizePathname } from './SiteLink';
import { Terminal, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const STATIC_PATHS = ['/', '/tools', '/categories', '/about', '/privacy', '/terms', '/contact'];

export default function Header() {
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = normalizePathname(useLocation().pathname);

  // Default to the dark developer theme; respect a saved choice or an OS light preference.
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('fdt-theme'); } catch (e) { /* storage unavailable */ }
    const prefersLight = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches;
    const wantDark = saved ? saved === 'dark' : !prefersLight;
    document.documentElement.classList.toggle('dark', wantDark);
    setDark(wantDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
    try { localStorage.setItem('fdt-theme', next ? 'dark' : 'light'); } catch (e) { /* ignore */ }
  };

  // Any tool page counts as "All Tools" so the menu always shows where you are.
  const isToolPage = !STATIC_PATHS.includes(pathname) && !pathname.startsWith('/guides');
  const items = [
    { to: '/', label: 'Home', active: pathname === '/' },
    { to: '/tools', label: 'All Tools', active: pathname === '/tools' || isToolPage },
    { to: '/categories', label: 'Categories', active: pathname === '/categories' },
    { to: '/guides', label: 'Guides', active: pathname.startsWith('/guides') },
  ];

  const links = items.map((i) => (
    <Link
      key={i.to}
      to={i.to}
      aria-current={i.active ? 'page' : undefined}
      className={`nav-link ${i.active ? 'is-active' : ''}`}
    >
      {i.label}
    </Link>
  ));

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="h-16 flex items-center justify-between gap-3">
          <Link to="/" className="brand" aria-label="OnlineDeveloperTool - home">
            <span className="brand-mark"><Terminal size={20} strokeWidth={3} /></span>
            <span className="brand-text truncate">
              <span className="brand-free">Online</span>DeveloperTool
            </span>
          </Link>
          <nav aria-label="Main" className="hidden md:flex items-center gap-2">{links}</nav>
          <button
            type="button"
            onClick={toggleDark}
            className="icon-btn"
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        {/* Mobile menu: scrolls inside itself, never the page */}
        <nav aria-label="Main (mobile)" className="md:hidden flex items-center gap-2 pb-2 overflow-x-auto">{links}</nav>
      </div>
    </header>
  );
}
