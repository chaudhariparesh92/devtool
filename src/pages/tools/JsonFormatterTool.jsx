import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
export default function JsonFormatterTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');
  const isMinify = path.includes('minifi');
  const isValidate = path.includes('validat');

  const process = () => {
    try {
      if (!inp.trim()) return;
      const p = JSON.parse(inp);
      if (isMinify) setOut(JSON.stringify(p));
      else if (isValidate) { setOut('Valid JSON!'); setErr(''); }
      else setOut(JSON.stringify(p, null, 2));
      if (!isValidate) setErr('');
    } catch (e) { setErr(e.message); setOut(''); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Process JSON data." path={path}>
      <div className="p-6 space-y-4 flex flex-col h-full">
        <textarea className="w-full flex-1 min-h-[200px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Paste JSON here..."></textarea>
        <div>
          <button onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Process</button>
        </div>
        {err && <div className="p-4 bg-red-100 text-red-700 rounded border border-red-200">Error: {err}</div>}
        {out && <textarea readOnly className={`w-full flex-1 min-h-[200px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded ${isValidate ? 'text-green-600' : ''}`} value={out}></textarea>}
      </div>
    </ToolLayout>
  );
}