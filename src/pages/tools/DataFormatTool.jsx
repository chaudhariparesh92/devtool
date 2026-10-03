import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { load, dump } from 'js-yaml';
import formatXml from 'xml-formatter';

export default function DataFormatTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');

  const process = () => {
    setErr('');
    try {
      if (path === '/yaml-formatter') {
        const obj = load(inp);
        setOut(dump(obj));
      } else if (path === '/yaml-to-json') {
        const obj = load(inp);
        setOut(JSON.stringify(obj, null, 2));
      } else if (path === '/csv-to-json') {
        const lines = inp.split('\n').filter(l => l.trim().length > 0);
        const headers = lines[0].split(',');
        const res = lines.slice(1).map(l => {
          const obj = {};
          l.split(',').forEach((val, i) => obj[headers[i] ? headers[i].trim() : `col${i}`] = val.trim());
          return obj;
        });
        setOut(JSON.stringify(res, null, 2));
      } else if (path === '/json-to-csv') {
        const arr = JSON.parse(inp);
        if (!Array.isArray(arr) || arr.length === 0) throw new Error("Need an array of objects");
        const headers = Object.keys(arr[0]);
        let csv = headers.join(',') + '\n';
        arr.forEach(row => { csv += headers.map(h => row[h]).join(',') + '\n'; });
        setOut(csv);
      } else if (path === '/xml-formatter') {
        setOut(formatXml(inp, { collapseContent: true }));
      } else if (path === '/xml-validator') {
        const parser = new DOMParser();
        const dom = parser.parseFromString(inp, "application/xml");
        const pe = dom.querySelector("parsererror");
        if(pe) throw new Error("XML Validation Error: " + pe.textContent);
        setOut("Valid XML!");
      }
    } catch(e) { setErr(e.message); setOut(''); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Data format conversion and processing." path={path}>
      <div className="p-6 grid md:grid-cols-2 gap-4 h-[500px]">
        <div className="flex flex-col gap-4">
          <textarea className="w-full flex-1 p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Input Data..."></textarea>
          <button onClick={process} className="px-6 py-2 w-full bg-indigo-600 text-white rounded">Process</button>
          {err && <div className="text-red-600 p-2 bg-red-50 border rounded text-sm">{err}</div>}
        </div>
        <textarea readOnly className="w-full h-full p-4 font-mono text-sm bg-indigo-50 dark:bg-indigo-900/20 border rounded" value={out} placeholder="Output..."></textarea>
      </div>
    </ToolLayout>
  );
}