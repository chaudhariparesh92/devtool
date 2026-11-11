import { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';
import { formatUuid, validateUuid, parseUuid } from '../../utils/uuid';

function uuidv7() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const ms = BigInt(Date.now());
  for (let i = 5; i >= 0; i--) bytes[i] = Number((ms >> BigInt((5 - i) * 8)) & 255n);
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function downloadTxt(text, filename = 'uuids.txt') {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function UuidTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState('v4');
  const [fmt, setFmt] = useState('standard');
  const isGen = path.includes('generator');
  const isVal = path.includes('validator');
  const isPar = path.includes('parser');

  const generate = useCallback(() => {
    const fn = version === 'v7' ? uuidv7 : () => crypto.randomUUID();
    const list = Array.from({ length: count }, () => formatUuid(fn(), fmt));
    setOut(list.join('\n'));
  }, [count, version, fmt]);

  // One UUID ready on first paint (and when controls change) so the page matches competitor UX.
  useEffect(() => {
    if (isGen) generate();
  }, [isGen, generate]);

  const process = () => {
    if (isVal) setOut(validateUuid(inp).label);
    else if (isPar) setOut(parseUuid(inp));
  };

  const primary = out ? out.split('\n')[0] : '';

  return (
    <ToolLayout
      title={path.replace('/', '').replace(/-/g, ' ').toUpperCase()}
      desc="Generate, validate and inspect RFC UUIDs in your browser."
      path={path}
    >
      <div className="p-6 flex flex-col items-center gap-6">
        {isGen ? (
          <div className="w-full max-w-2xl space-y-4">
            {/* Instant primary UUID — matches uuidgenerator.net above-the-fold pattern */}
            {primary && (
              <div className="rounded-xl border-2 p-5 text-center space-y-3" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                  Your {version === 'v7' ? 'Version 7' : 'Version 4'} UUID
                </p>
                <p className="font-mono text-lg sm:text-xl break-all select-all">{primary}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <CopyButton text={primary} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold" />
                  <button
                    type="button"
                    onClick={generate}
                    className="px-4 py-2 border rounded font-bold"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Generate another
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="uuid-count">Quantity</label>
              <select
                id="uuid-count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="p-2 border rounded dark:bg-gray-700"
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700"
                aria-label="UUID version"
              >
                <option value="v4">UUID v4 (random)</option>
                <option value="v7">UUID v7 (time-ordered)</option>
              </select>
              <select
                aria-label="Output format"
                value={fmt}
                onChange={(e) => setFmt(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700"
              >
                <option value="standard">Standard</option>
                <option value="upper">UPPERCASE</option>
                <option value="nohyphen">No hyphens</option>
                <option value="braces">{'{braces}'}</option>
              </select>
              <button type="button" onClick={generate} className="px-6 py-2 bg-indigo-600 text-white rounded font-bold">
                Generate UUIDs
              </button>
              {out && (
                <button
                  type="button"
                  onClick={() => downloadTxt(out, count > 1 ? 'uuids.txt' : 'uuid.txt')}
                  className="px-4 py-2 border rounded font-bold"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Download .txt
                </button>
              )}
            </div>

            {out && count > 1 && (
              <OutputBox value={out} label={`Generated UUIDs (${count})`} className="w-full h-64" textareaClassName="text-left" />
            )}
            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              Generated in your browser with a secure random source. Nothing is uploaded.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-4">
            <input
              type="text"
              className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded"
              value={inp}
              onChange={(e) => setInp(e.target.value)}
              placeholder="Enter UUID…"
            />
            <button type="button" onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded">
              {isVal ? 'Validate UUID' : 'Parse UUID'}
            </button>
            {out && (
              <div className="relative p-4 pr-24 font-bold border rounded bg-gray-50 dark:bg-gray-900">
                <pre className="whitespace-pre-wrap">{out}</pre>
                <CopyButton text={out} className="absolute top-2 right-2" />
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
