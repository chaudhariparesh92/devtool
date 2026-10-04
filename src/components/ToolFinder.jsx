import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../data/tools';

// Live filter over the real tool list (src/data/tools.js). No new tools are invented.
export default function ToolFinder() {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return TOOLS.filter((t) => t.name.toLowerCase().includes(term) || t.path.includes(term.replace(/\s+/g, '-'))).slice(0, 8);
  }, [q]);

  return (
    <div className="card p-5 sm:p-6">
      <label htmlFor="tool-finder" className="block font-black text-lg mb-2">Find a tool</label>
      <input
        id="tool-finder"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Try: json, base64, uuid, cron, jwt..."
        autoComplete="off"
        spellCheck={false}
        className="w-full p-3 font-code text-base rounded-lg border-[3px]"
        style={{ background: 'var(--field)', color: 'var(--ink)', borderColor: 'var(--border)' }}
      />
      <div aria-live="polite" className="mt-3">
        {q.trim() && results.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>No match. Try a format name like "xml" or a task like "hash".</p>
        )}
        {results.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-2">
            {results.map((t) => (
              <li key={t.path}>
                <Link to={t.path} className="block px-3 py-2 rounded-lg border-2 font-bold text-sm card-hover" style={{ borderColor: 'var(--border)' }}>
                  {t.name} <span className="card-arrow" aria-hidden="true">&rarr;</span>
                  <span className="block text-xs font-normal" style={{ color: 'var(--muted)' }}>{t.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
