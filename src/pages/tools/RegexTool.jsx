import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import CopyButton from '../../components/CopyButton';

export default function RegexTool({ path }) {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [out, setOut] = useState([]);
  const [err, setErr] = useState('');

  const testRegex = () => {
    try {
      setErr('');
      const re = new RegExp(regex, flags);
      const matches = [...text.matchAll(re)];
      setOut(matches);
    } catch(e) { setErr(e.message); setOut([]); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Test regular expressions safely in your browser." path={path}>
      <div className="p-6 space-y-4">
        <div className="flex gap-2 items-center">
          <span className="text-xl text-gray-500">/</span>
          <input type="text" className="flex-1 p-2 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={regex} onChange={e=>setRegex(e.target.value)} placeholder="Pattern" />
          <span className="text-xl text-gray-500">/</span>
          <input type="text" className="w-16 p-2 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={flags} onChange={e=>setFlags(e.target.value)} placeholder="Flags" />
          <button onClick={testRegex} className="px-6 py-2 bg-indigo-600 text-white rounded">Test</button>
        </div>
        {err && <div className="text-red-600 p-2 bg-red-50 border rounded text-sm">{err}</div>}
        <textarea className="w-full h-32 p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={text} onChange={e=>setText(e.target.value)} placeholder="Test string..."></textarea>
        <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Matches ({out.length})</h3>
            <CopyButton text={out.map((m) => m[0]).join('\n')} label="Copy matches" disabled={out.length === 0} />
          </div>
          {out.map((m, i) => (
             <div key={i} className="p-2 mb-2 bg-white dark:bg-gray-800 border rounded">
               <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{m[0]}</span>
               <span className="text-xs text-gray-500 ml-2">Index: {m.index}</span>
             </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}