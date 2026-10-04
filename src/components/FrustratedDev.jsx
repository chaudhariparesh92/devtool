// Inline SVG illustration (no image requests, no dependencies).
// Left: a frustrated developer buried in tabs and errors. Right: the same task, done in one tab.
export default function FrustratedDev({ className = '' }) {
  const err = '#ff6b6b';
  return (
    <figure
      className={`m-0 ${className}`}
      role="img"
      aria-label="Illustration: a frustrated developer with hands on head, surrounded by error messages, many browser tabs and cold coffee, next to a calm FREE Developer Tool window where the task is done in one click."
    >
      <div className="card overflow-hidden" style={{ background: 'var(--surface-2)' }}>
        <svg viewBox="0 0 640 340" className="block w-full h-auto" aria-hidden="true" focusable="false">
          {/* ---------- BEFORE ---------- */}
          {/* tab strip */}
          <g stroke="#14111f" strokeWidth="1.5">
            {Array.from({ length: 11 }).map((_, i) => (
              <rect key={i} x={22 + i * 27} y="16" width="25" height="14" rx="3" fill={i % 3 === 0 ? '#ffd93d' : i % 3 === 1 ? '#7dd3fc' : '#ffb3d1'} />
            ))}
          </g>
          {/* monitor */}
          <rect x="45" y="36" width="250" height="140" rx="10" fill="#0b0813" stroke="#14111f" strokeWidth="3" />
          <g fontFamily="ui-monospace, Menlo, monospace" fontSize="10" fill={err}>
            <text x="58" y="58">TypeError: undefined is not</text>
            <text x="58" y="74">SyntaxError: Unexpected token {'}'}</text>
            <text x="58" y="90" fill="#ffd93d">Invalid base64 string</text>
            <text x="58" y="106">401 Unauthorized</text>
            <text x="58" y="122" fill="#ffd93d">Why is this one-liner so long??</text>
            <text x="58" y="138">Error: Cannot parse timestamp</text>
            <text x="58" y="154" fill="#9ae6b4">$ <tspan fill="#e8e3ff">paste, squint, retry...</tspan></text>
          </g>
          <rect x="150" y="176" width="40" height="18" fill="#14111f" />
          {/* desk */}
          <rect x="20" y="288" width="310" height="14" rx="4" fill="#8b5cf6" stroke="#14111f" strokeWidth="3" />
          {/* mug + steam */}
          <g stroke="#14111f" strokeWidth="2.5">
            <rect x="262" y="258" width="26" height="30" rx="4" fill="#fff" />
            <path d="M288 266 q12 2 0 16" fill="none" />
          </g>
          <path className="float-a" d="M268 250 q-5 -8 0 -14 M278 250 q-5 -8 0 -14" stroke="#9aa0b4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* sticky note */}
          <g className="wiggle">
            <rect x="238" y="112" width="70" height="64" fill="#ff7eb6" stroke="#14111f" strokeWidth="2.5" transform="rotate(5 273 144)" />
            <g fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="10" fontWeight="800" fill="#14111f" transform="rotate(5 273 144)">
              <text x="246" y="132">why am I</text>
              <text x="246" y="146">doing this</text>
              <text x="246" y="160">manually?!</text>
            </g>
          </g>
          {/* developer */}
          <g stroke="#14111f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <rect x="128" y="246" width="94" height="44" rx="16" fill="#c6ff3d" />
            {/* arms up to head */}
            <path d="M134 262 Q108 244 138 214" fill="none" strokeWidth="9" stroke="#f1b98a" />
            <path d="M216 262 Q242 244 212 214" fill="none" strokeWidth="9" stroke="#f1b98a" />
            <path d="M134 262 Q108 244 138 214" fill="none" strokeWidth="3" />
            <path d="M216 262 Q242 244 212 214" fill="none" strokeWidth="3" />
            {/* head */}
            <circle cx="175" cy="214" r="34" fill="#f1b98a" />
            {/* hair spikes */}
            <path d="M144 200 l6 -18 l8 12 l8 -18 l8 16 l10 -16 l6 18 l8 -10 l4 14" fill="#14111f" />
            {/* angry brows */}
            <path d="M156 206 l16 6 M194 206 l-16 6" fill="none" strokeWidth="4" />
            {/* eyes */}
            <circle cx="164" cy="217" r="3.2" fill="#14111f" stroke="none" />
            <circle cx="186" cy="217" r="3.2" fill="#14111f" stroke="none" />
            {/* grimace */}
            <path d="M158 237 l6 -5 l6 5 l6 -5 l6 5 l6 -5" fill="none" strokeWidth="3" />
          </g>
          {/* sweat drop */}
          <path d="M213 190 q7 10 0 14 q-7 -4 0 -14z" fill="#7dd3fc" stroke="#14111f" strokeWidth="2" />

          {/* ---------- arrow ---------- */}
          <g>
            <path d="M334 150 H372" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
            <path d="M362 136 L376 150 L362 164" stroke="var(--ink)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* ---------- AFTER ---------- */}
          <g>
            <rect x="388" y="56" width="236" height="188" rx="12" fill="#0b0813" stroke="#14111f" strokeWidth="3" />
            <rect x="388" y="56" width="236" height="26" rx="12" fill="#1b1530" />
            <circle cx="404" cy="69" r="5" fill="#ff5f56" />
            <circle cx="420" cy="69" r="5" fill="#ffbd2e" />
            <circle cx="436" cy="69" r="5" fill="#27c93f" />
            <g fontFamily="ui-monospace, Menlo, monospace" fontSize="11">
              <text x="402" y="104" fill="#b9b2d6">paste the mess</text>
              <text x="402" y="124" fill="#b9b2d6">click once</text>
              <text x="402" y="144" fill="#c6ff3d">&#10003; done in 1 tab</text>
            </g>
            <circle cx="506" cy="196" r="30" fill="#c6ff3d" stroke="#14111f" strokeWidth="3" />
            <path d="M491 197 l11 11 l21 -23" stroke="#14111f" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="424" y="262" width="164" height="30" rx="8" fill="#ff3d8b" stroke="#14111f" strokeWidth="3" />
            <text x="506" y="282" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="13" fontWeight="900" fill="#14111f">FREE Developer Tool</text>
          </g>
        </svg>
        <figcaption className="flex flex-wrap justify-between gap-2 px-4 py-3 border-t-[3px]" style={{ borderColor: 'var(--border)' }}>
          <span className="sticker pink">Before: 14 tabs &amp; 3 sketchy sites</span>
          <span className="sticker lime">After: one tab, one click</span>
        </figcaption>
      </div>
    </figure>
  );
}
