import { useEffect, useMemo, useRef, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import FileDropZone from '../../components/FileDropZone';
import CopyButton from '../../components/CopyButton';
import { useLocalStorage } from '../../utils/useLocalStorage';

const EXAMPLE = '{"name":"Ada","tags":["dev","math"],"active":true,"profile":{"city":"London","score":42}}';

function parserLocation(message, input) {
  const match = String(message || '').match(/position\s+(\d+)/i);
  if (!match) return null;
  const position = Number(match[1]);
  const before = input.slice(0, position);
  return { position, line: before.split('\n').length, column: position - before.lastIndexOf('\n') };
}

function parseIndent(value) { return value === 'tab' ? '\t' : Number(value); }
function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') return Object.keys(value).sort((a,b) => a.localeCompare(b)).reduce((o,k) => { o[k] = sortKeys(value[k]); return o; }, {});
  return value;
}
function stats(value, raw) {
  const text = raw || '';
  let keys = 0, strings = 0, arrays = 0, objects = 0;
  const walk = (v) => {
    if (Array.isArray(v)) { arrays++; v.forEach(walk); }
    else if (v && typeof v === 'object') { objects++; Object.entries(v).forEach(([k,x]) => { keys++; if (typeof x === 'string') strings++; walk(x); }); }
    else if (typeof v === 'string') strings++;
  };
  walk(value);
  return `Input: ${text.length.toLocaleString()} characters\nKeys: ${keys.toLocaleString()}\nObjects: ${objects.toLocaleString()}\nArrays: ${arrays.toLocaleString()}\nString values: ${strings.toLocaleString()}`;
}

export default function JsonFormatterTool({ path }) {
  const [inp, setInp] = useLocalStorage(`odt:${path}:input`, '');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');
  const [indent, setIndent] = useLocalStorage(`odt:${path}:indent`, '2');
  const [sort, setSort] = useLocalStorage(`odt:${path}:sort`, false);
  const [tree, setTree] = useState(false);
  const [sourceUrl, setSourceUrl] = useState('');
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [parsed, setParsed] = useState(null);
  const fileRef = useRef(null);

  const isMinify = path.includes('minifi');
  const isValidate = path.includes('validat');
  const actionLabel = isValidate ? 'Validate JSON' : isMinify ? 'Minify JSON' : 'Format JSON';
  const outputLabel = isValidate ? 'Validation result' : isMinify ? 'Minified JSON' : 'Formatted JSON';

  const process = () => {
    if (!inp.trim()) { setErr('Paste JSON into the input box first.'); setOut(''); setParsed(null); return; }
    try {
      const value = JSON.parse(inp);
      const working = sort ? sortKeys(value) : value;
      setParsed(working);
      if (isMinify) setOut(JSON.stringify(working));
      else if (isValidate) setOut('Valid JSON!');
      else setOut(JSON.stringify(working, null, parseIndent(indent)));
      setErr('');
    } catch (e) {
      setOut(''); setParsed(null);
      const location = parserLocation(e.message, inp);
      if (location) {
        const lines = inp.split('\n');
        const badLine = lines[location.line - 1] || '';
        setErr(`${e.message}\nLine ${location.line}, column ${location.column}\n${badLine}`);
      } else setErr(e.message || 'Invalid JSON.');
    }
  };

  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); process(); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });

  const clear = () => { setInp(''); setOut(''); setErr(''); setParsed(null); setSourceUrl(''); };
  const loadExample = () => { setInp(EXAMPLE); setOut(''); setErr(''); setParsed(null); };
  const loadFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.json') && file.type && file.type !== 'application/json') { setErr('Please choose a JSON file.'); return; }
    const reader = new FileReader(); reader.onload = () => { setInp(String(reader.result || '')); setOut(''); setErr(''); setParsed(null); }; reader.onerror = () => setErr('Could not read that file.'); reader.readAsText(file);
  };
  const loadUrl = async () => {
    const url = sourceUrl.trim();
    if (!url) return setErr('Enter a JSON URL first.');
    try { const parsedUrl = new URL(url); if (!/^https?:$/.test(parsedUrl.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported.');
      setLoadingUrl(true); setErr(''); const response = await fetch(parsedUrl.href, { headers: { Accept: 'application/json,text/plain;q=0.9,*/*;q=0.8' } });
      if (!response.ok) throw new Error(`Request failed with HTTP ${response.status}.`); setInp(await response.text()); setOut(''); setParsed(null);
    } catch (e) { setErr(`${e.message} If CORS blocks browser requests, use the file picker instead.`); } finally { setLoadingUrl(false); }
  };

  const treeText = useMemo(() => parsed == null ? '' : JSON.stringify(parsed, null, 2), [parsed]);

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Format, validate, inspect and minify JSON locally in your browser." path={path}>
      <div className="p-6 space-y-4 flex flex-col h-full">
        {!isValidate && !isMinify && <div className="flex flex-wrap items-center gap-3" aria-label="Formatting options">
          <label className="text-sm font-medium" htmlFor="json-indent">Indentation</label>
          <select id="json-indent" value={indent} onChange={(e) => setIndent(e.target.value)} className="px-3 py-2 rounded border bg-white dark:bg-gray-900 dark:text-white">
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={String(n)}>{n} {n === 1 ? 'space' : 'spaces'}</option>)}
            <option value="tab">Tabs</option>
          </select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} /> Sort keys</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={tree} onChange={(e) => setTree(e.target.checked)} /> Tree view</label>
        </div>}

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadUrl()} placeholder="Optional: load JSON from an HTTPS URL" aria-label="JSON URL" className="w-full px-4 py-2 rounded border bg-gray-50 dark:bg-gray-900 dark:text-white" />
          <button type="button" onClick={loadUrl} disabled={loadingUrl} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">{loadingUrl ? 'Loading…' : 'Load URL'}</button>
        </div>

        <textarea className="w-full min-h-[240px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={inp} onChange={(e) => setInp(e.target.value)} placeholder="Paste JSON here, or drop a .json file…" aria-label="JSON input" spellCheck="false" />
        <FileDropZone accept=".json,application/json" onFile={loadFile} label="Choose JSON file or drag and drop one here" />

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{actionLabel}</button>
          <button type="button" onClick={loadExample} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Load example</button>
          <button type="button" onClick={clear} className="px-4 py-2 bg-red-100 text-red-700 rounded">Clear</button>
          <span className="text-xs self-center text-gray-500">Ctrl/Cmd + Enter to run</span>
        </div>

        {err && <pre role="alert" className="whitespace-pre-wrap p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded border border-red-200 dark:border-red-800">JSON error: {err}</pre>}
        {out && <OutputBox value={out} label={outputLabel} className="min-h-[220px]" textareaClassName={isValidate ? 'text-green-600 font-bold' : ''} downloadFilename={isValidate ? 'json-validation.txt' : isMinify ? 'formatted.min.json' : 'formatted.json'} />}
        {parsed != null && !isValidate && <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900"><h3 className="font-bold mb-2">JSON statistics</h3><pre className="text-sm whitespace-pre-wrap">{stats(parsed, inp)}</pre></div>
          {tree && <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900"><div className="flex justify-between gap-2 mb-2"><h3 className="font-bold">Tree / structured view</h3><CopyButton text={treeText} /></div><pre className="text-sm overflow-auto max-h-72 whitespace-pre-wrap">{treeText}</pre></div>}
        </div>}
        <p className="text-xs text-gray-500">Formatting changes whitespace only. JavaScript parsing can change very large integer precision, collapse duplicate keys, or reorder integer-like keys, so keep the original input when exact preservation matters.</p>
      </div>
    </ToolLayout>
  );
}
