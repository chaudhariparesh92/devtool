import { useRef, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';

const EXAMPLE = '{"name":"Ada","tags":["dev","math"],"active":true}';

function parserLocation(message, input) {
  const match = String(message || '').match(/position\s+(\d+)/i);
  if (!match) return null;
  const position = Number(match[1]);
  const before = input.slice(0, position);
  return {
    position,
    line: before.split('\n').length,
    column: position - before.lastIndexOf('\n'),
  };
}

function parseIndent(value) {
  if (value === 'tab') return '\t';
  return Number(value);
}

export default function JsonFormatterTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');
  const [indent, setIndent] = useState('2');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loadingUrl, setLoadingUrl] = useState(false);
  const fileRef = useRef(null);

  const isMinify = path.includes('minifi');
  const isValidate = path.includes('validat');
  const actionLabel = isValidate ? 'Validate JSON' : isMinify ? 'Minify JSON' : 'Format JSON';
  const outputLabel = isValidate ? 'Validation result' : isMinify ? 'Minified JSON' : 'Formatted JSON';

  const process = () => {
    if (!inp.trim()) {
      setErr('Paste JSON into the input box first.');
      setOut('');
      return;
    }
    try {
      const parsed = JSON.parse(inp);
      if (isMinify) setOut(JSON.stringify(parsed));
      else if (isValidate) setOut('Valid JSON!');
      else setOut(JSON.stringify(parsed, null, parseIndent(indent)));
      setErr('');
    } catch (e) {
      setOut('');
      const location = parserLocation(e.message, inp);
      setErr(location ? `${e.message} (line ${location.line}, column ${location.column})` : e.message);
    }
  };

  const clear = () => {
    setInp('');
    setOut('');
    setErr('');
    setSourceUrl('');
  };

  const loadExample = () => {
    setInp(EXAMPLE);
    setOut('');
    setErr('');
  };

  const loadFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.json') && file.type && file.type !== 'application/json') {
      setErr('Please choose a JSON file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setInp(String(reader.result || ''));
      setOut('');
      setErr('');
    };
    reader.onerror = () => setErr('Could not read that file.');
    reader.readAsText(file);
  };

  const loadUrl = async () => {
    const url = sourceUrl.trim();
    if (!url) {
      setErr('Enter a JSON URL first.');
      return;
    }
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      if (!/^https?:$/.test(parsedUrl.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported.');
    } catch (e) {
      setErr(e.message || 'Enter a valid HTTP or HTTPS URL.');
      return;
    }

    setLoadingUrl(true);
    setErr('');
    try {
      const response = await fetch(parsedUrl.href, { headers: { Accept: 'application/json,text/plain;q=0.9,*/*;q=0.8' } });
      if (!response.ok) throw new Error(`Request failed with HTTP ${response.status}.`);
      const text = await response.text();
      setInp(text);
      setOut('');
    } catch (e) {
      setErr(`${e.message} If the site blocks browser requests with CORS, download the JSON and use the file picker instead.`);
    } finally {
      setLoadingUrl(false);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files?.[0]);
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Process JSON data." path={path}>
      <div className="p-6 space-y-4 flex flex-col h-full">
        {!isValidate && !isMinify && (
          <div className="flex flex-wrap items-center gap-3" aria-label="Formatting options">
            <label className="text-sm font-medium" htmlFor="json-indent">Indentation</label>
            <select id="json-indent" value={indent} onChange={(e) => setIndent(e.target.value)} className="px-3 py-2 rounded border bg-white dark:bg-gray-900 dark:text-white">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tabs</option>
            </select>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadUrl()}
            placeholder="Optional: load JSON from an HTTPS URL"
            aria-label="JSON URL"
            className="w-full px-4 py-2 rounded border bg-gray-50 dark:bg-gray-900 dark:text-white"
          />
          <button type="button" onClick={loadUrl} disabled={loadingUrl} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 disabled:opacity-50">
            {loadingUrl ? 'Loading…' : 'Load URL'}
          </button>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="relative"
        >
          <textarea
            className="w-full min-h-[220px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={inp}
            onChange={(e) => setInp(e.target.value)}
            placeholder="Paste JSON here, or drag and drop a .json file…"
            aria-label="JSON input"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-1.5 rounded text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300">Choose JSON file</button>
            <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => loadFile(e.target.files?.[0])} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">{actionLabel}</button>
          <button type="button" onClick={loadExample} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300">Load example</button>
          <button type="button" onClick={clear} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Clear</button>
        </div>

        {err && <div role="alert" className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded border border-red-200 dark:border-red-800">{isValidate || !isMinify ? 'JSON error: ' : 'JSON error: '}{err}</div>}

        {out && (
          <OutputBox
            value={out}
            label={outputLabel}
            className="min-h-[220px]"
            textareaClassName={isValidate ? 'text-green-600 font-bold' : ''}
            downloadFilename={isValidate ? 'json-validation.txt' : isMinify ? 'formatted.min.json' : 'formatted.json'}
          />
        )}
      </div>
    </ToolLayout>
  );
}
