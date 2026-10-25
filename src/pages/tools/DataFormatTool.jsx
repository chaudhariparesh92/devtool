import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import FileDropZone from '../../components/FileDropZone';
import { load, dump } from 'js-yaml';
import formatXml from 'xml-formatter';

function parseCsvLine(line, delimiter) {
  const cells = []; let cell = ''; let quoted = false;
  for (let i=0;i<line.length;i++) { const ch=line[i]; if (ch === '"') { if (quoted && line[i+1] === '"') { cell += '"'; i++; } else quoted = !quoted; } else if (ch === delimiter && !quoted) { cells.push(cell); cell=''; } else cell += ch; }
  cells.push(cell); return cells;
}
function csvRows(text, delimiter) { return text.replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean).map(l=>parseCsvLine(l, delimiter)); }
function csvEscape(v, delimiter) { const s = v == null ? '' : String(v); return /["\n\r]/.test(s) || s.includes(delimiter) ? `"${s.replace(/"/g,'""')}"` : s; }

export default function DataFormatTool({ path }) {
  const [inp, setInp] = useState(''); const [out, setOut] = useState(''); const [err, setErr] = useState(''); const [delimiter, setDelimiter] = useState(',');
  const isCsv = path.includes('csv-');
  const process = () => {
    setErr('');
    try {
      if (!inp.trim()) throw new Error('Paste input first.');
      if (path === '/yaml-formatter') setOut(dump(load(inp), { noRefs: true }));
      else if (path === '/yaml-to-json') setOut(JSON.stringify(load(inp), null, 2));
      else if (path === '/csv-to-json') { const rows=csvRows(inp,delimiter); if(rows.length<1) throw new Error('CSV needs a header row.'); const headers=rows[0].map((h,i)=>h.trim()||`column${i+1}`); const res=rows.slice(1).map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i] ?? '']))); setOut(JSON.stringify(res,null,2)); }
      else if (path === '/json-to-csv') { const arr=JSON.parse(inp); if(!Array.isArray(arr)||!arr.length||arr.some(x=>!x||typeof x!=='object'||Array.isArray(x))) throw new Error('JSON to CSV expects an array of objects.'); const headers=[...new Set(arr.flatMap(o=>Object.keys(o)))]; setOut(headers.join(delimiter)+'\n'+arr.map(o=>headers.map(h=>csvEscape(o[h],delimiter)).join(delimiter)).join('\n')); }
      else if (path === '/xml-formatter') setOut(formatXml(inp, { collapseContent: true }));
      else if (path === '/xml-validator') { const dom=new DOMParser().parseFromString(inp,'application/xml'); const pe=dom.querySelector('parsererror'); if(pe) throw new Error(pe.textContent.replace(/\s+/g,' ').trim()); setOut('Valid XML!'); }
    } catch(e) { setErr(e.message || 'Could not process input.'); setOut(''); }
  };
  const loadFile = (file) => { if(!file) return; const r=new FileReader(); r.onload=()=>setInp(String(r.result||'')); r.onerror=()=>setErr('Could not read that file.'); r.readAsText(file); };
  const example = () => setInp(path.includes('yaml') ? 'name: Ada\nactive: true\ntags:\n  - dev\n  - math' : path.includes('xml') ? '<root><user id="1">Ada</user></root>' : 'name,age\nAda,36\nLinus,54');
  return (
    <ToolLayout title={path.replace('/','').replace(/-/g,' ').toUpperCase()} desc="Format, validate and convert structured data in your browser." path={path}>
      <div className="p-6 space-y-4">
        {isCsv && <div className="flex flex-wrap items-center gap-3"><label htmlFor="delimiter" className="text-sm font-medium">Delimiter</label><select id="delimiter" value={delimiter} onChange={e=>setDelimiter(e.target.value)} className="px-3 py-2 border rounded bg-white dark:bg-gray-900"><option value=",">Comma (,)</option><option value=";">Semicolon (;)</option><option value="\t">Tab</option></select></div>}
        <div className="grid md:grid-cols-2 gap-4 min-h-[480px]">
          <div className="flex flex-col gap-3"><textarea className="w-full flex-1 min-h-[360px] p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Paste input data…" spellCheck="false" /><FileDropZone accept={isCsv ? '.csv,text/csv' : '.txt,.json,.xml,.yaml,.yml'} onFile={loadFile} label="Choose or drop a file" /><div className="flex gap-2"><button onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded">Process</button><button onClick={example} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Load example</button><button onClick={()=>{setInp('');setOut('');setErr('')}} className="px-4 py-2 bg-red-100 text-red-700 rounded">Clear</button></div>{err&&<div role="alert" className="text-red-600 p-3 bg-red-50 border rounded text-sm">{err}</div>}</div>
          <OutputBox value={out} label="Output" placeholder="Output…" className="h-full" downloadFilename={path.includes('csv')?'converted.csv':path.includes('json')?'converted.json':'formatted.txt'} />
        </div>
      </div>
    </ToolLayout>
  );
}
