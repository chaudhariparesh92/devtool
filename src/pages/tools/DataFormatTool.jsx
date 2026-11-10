import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import FileDropZone from '../../components/FileDropZone';

function parseCsvLine(line, delimiter) {
  const cells = []; let cell = ''; let quoted = false;
  for (let i=0;i<line.length;i++) { const ch=line[i]; if (ch === '"') { if (quoted && line[i+1] === '"') { cell += '"'; i++; } else quoted = !quoted; } else if (ch === delimiter && !quoted) { cells.push(cell); cell=''; } else cell += ch; }
  cells.push(cell); return cells;
}
function csvRows(text, delimiter) { return text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean).map(l=>parseCsvLine(l, delimiter)); }
function csvEscape(v, delimiter) { const s = v == null ? '' : String(v); return /["\n\r]/.test(s) || s.includes(delimiter) ? `"${s.replace(/"/g,'""')}"` : s; }

// ---- XML validator helpers (pure functions; browsers word parser errors differently) ----
// Turns the browser's parsererror text into a short message plus a line and column when one is reported.
// Chrome and Safari: "error on line 1 at column 17: ...". Firefox: "... Line Number 1, Column 17: ...".
function xmlErrorInfo(raw) {
  let msg = String(raw || '').replace(/\s+/g, ' ').trim();
  const m = msg.match(/line\s+(\d+)\s+at\s+column\s+(\d+)/i) || msg.match(/Line Number\s+(\d+),\s*Column\s+(\d+)/i);
  msg = msg
    .replace(/^This page contains the following errors:\s*/i, '')
    .replace(/\s*Below is a rendering of the page up to the first error\.?\s*$/i, '')
    .replace(/^XML Parsing Error:\s*/i, '')
    .replace(/^error on line \d+ at column \d+:\s*/i, '')
    .replace(/\s*Location:\s*\S+\s*Line Number \d+, Column \d+:?.*$/i, '')
    .trim();
  return { message: msg || 'The XML is not well-formed.', line: m ? Number(m[1]) : null, column: m ? Number(m[2]) : null };
}

// Shows the offending line with a caret under the reported column. Long one-line (minified) XML is cut to a window.
function xmlExcerpt(source, line, column) {
  const text = String(source).split(/\r\n|\r|\n/)[line - 1];
  if (text === undefined) return '';
  const WINDOW = 60;
  const start = Math.max(0, column - 1 - WINDOW);
  const end = Math.min(text.length, column - 1 + WINDOW);
  const shown = (start > 0 ? '\u2026' : '') + text.slice(start, end) + (end < text.length ? '\u2026' : '');
  const caret = Math.max(0, column - 1 - start) + (start > 0 ? 1 : 0);
  return `${shown}\n${' '.repeat(caret)}^`;
}

function xmlErrorText(source, rawMessage) {
  const { message, line, column } = xmlErrorInfo(rawMessage);
  if (!line || !column) return message;
  const ex = xmlExcerpt(source, line, column);
  return `${message}\nLine ${line}, column ${column}${ex ? `\n${ex}` : ''}`;
}

function xmlSummary(dom, source) {
  const root = dom.documentElement;
  const all = dom.getElementsByTagName('*');
  let attrs = 0;
  for (let i = 0; i < all.length; i++) attrs += all[i].attributes.length;
  let depth = 0;
  const stack = [[root, 1]];
  while (stack.length) {
    const [el, d] = stack.pop();
    if (d > depth) depth = d;
    for (const c of el.children) stack.push([c, d + 1]);
  }
  const enc = source.match(/^\s*<\?xml[^>]*\bencoding\s*=\s*["']([^"']+)["']/i);
  return [
    'Valid XML!',
    `Root element: ${root.nodeName}`,
    `Elements: ${all.length}`,
    `Attributes: ${attrs}`,
    `Nesting depth: ${depth}`,
    enc ? `Declared encoding: ${enc[1]}` : null,
    `Size: ${source.length.toLocaleString()} characters`,
  ].filter(Boolean).join('\n');
}

const INVALID_XML_EXAMPLE = '<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>Tove</to>\n  <heading>Reminder</heading2>\n  <body>Call me this weekend</body>\n</note>';

export default function DataFormatTool({ path }) {
  const [inp, setInp] = useState(''); const [out, setOut] = useState(''); const [err, setErr] = useState(''); const [delimiter, setDelimiter] = useState(',');
  const isCsv = path.includes('csv-');
  const isXmlValidator = path === '/xml-validator';
  const process = async () => {
    setErr('');
    try {
      if (!inp.trim()) throw new Error('Paste input first.');
      if (path === '/yaml-formatter') { const { load, dump } = await import('js-yaml'); setOut(dump(load(inp), { noRefs: true })); }
      else if (path === '/yaml-to-json') { const { load } = await import('js-yaml'); setOut(JSON.stringify(load(inp), null, 2)); }
      else if (path === '/csv-to-json') { const rows=csvRows(inp,delimiter); if(rows.length<1) throw new Error('CSV needs a header row.'); const headers=rows[0].map((h,i)=>h.trim()||`column${i+1}`); const res=rows.slice(1).map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i] ?? '']))); setOut(JSON.stringify(res,null,2)); }
      else if (path === '/json-to-csv') { const arr=JSON.parse(inp); if(!Array.isArray(arr)||!arr.length||arr.some(x=>!x||typeof x!=='object'||Array.isArray(x))) throw new Error('JSON to CSV expects an array of objects.'); const headers=[...new Set(arr.flatMap(o=>Object.keys(o)))]; setOut(headers.join(delimiter)+'\n'+arr.map(o=>headers.map(h=>csvEscape(o[h],delimiter)).join(delimiter)).join('\n')); }
      else if (path === '/xml-formatter') { const { default: formatXml } = await import('xml-formatter'); setOut(formatXml(inp, { collapseContent: true })); }
      else if (path === '/xml-validator') { const dom=new DOMParser().parseFromString(inp,'application/xml'); const pe=dom.querySelector('parsererror'); if(pe) throw new Error(xmlErrorText(inp, pe.textContent)); setOut(xmlSummary(dom, inp)); }
    } catch(e) { setErr(e.message || 'Could not process input.'); setOut(''); }
  };
  const loadFile = (file) => { if(!file) return; const r=new FileReader(); r.onload=()=>setInp(String(r.result||'')); r.onerror=()=>setErr('Could not read that file.'); r.readAsText(file); };
  const example = () => setInp(path.includes('yaml') ? 'name: Ada\nactive: true\ntags:\n  - dev\n  - math' : path.includes('xml') ? '<root><user id="1">Ada</user></root>' : 'name,age\nAda,36\nLinus,54');
  const invalidExample = () => { setInp(INVALID_XML_EXAMPLE); setOut(''); setErr(''); };
  return (
    <ToolLayout title={path.replace('/','').replace(/-/g,' ').toUpperCase()} desc="Format, validate and convert structured data in your browser." path={path}>
      <div className="p-6 space-y-4">
        {isCsv && <div className="flex flex-wrap items-center gap-3"><label htmlFor="delimiter" className="text-sm font-medium">Delimiter</label><select id="delimiter" value={delimiter} onChange={e=>setDelimiter(e.target.value)} className="px-3 py-2 border rounded bg-white dark:bg-gray-900"><option value=",">Comma (,)</option><option value=";">Semicolon (;)</option><option value="\t">Tab</option></select></div>}
        <div className="grid md:grid-cols-2 gap-4 min-h-[480px]">
          <div className="flex flex-col gap-3"><textarea className="w-full flex-1 min-h-[360px] p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Paste input data…" spellCheck="false" /><FileDropZone accept={isCsv ? '.csv,text/csv' : '.txt,.json,.xml,.yaml,.yml'} onFile={loadFile} label="Choose or drop a file" /><div className="flex flex-wrap gap-2"><button onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded">Process</button><button onClick={example} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Load example</button>{isXmlValidator && <button onClick={invalidExample} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Load invalid example</button>}<button onClick={()=>{setInp('');setOut('');setErr('')}} className="px-4 py-2 bg-red-100 text-red-700 rounded">Clear</button></div>{err&&<div role="alert" className={`text-red-600 p-3 bg-red-50 border rounded text-sm overflow-x-auto${err.includes('\n') ? ' font-mono whitespace-pre' : ''}`}>{err}</div>}</div>
          <OutputBox value={out} label="Output" placeholder="Output…" className="h-full" downloadFilename={path.includes('csv')?'converted.csv':path.includes('json')?'converted.json':'formatted.txt'} />
        </div>
      </div>
    </ToolLayout>
  );
}
