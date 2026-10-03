import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
export default function JsonFormatterTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);
  
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
      setCopied(false);
    } catch (e) { setErr(e.message); setOut(''); }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Process JSON data." path={path}>
      <div className="p-6 space-y-4 flex flex-col h-full">
        <textarea className="w-full flex-1 min-h-[200px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded dark:text-white" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Paste JSON here..."></textarea>
        <div>
          <button onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">Process</button>
        </div>
        {err && <div className="p-4 bg-red-100 text-red-700 rounded border border-red-200">Error: {err}</div>}
        {out && (
          <div className="relative flex-1 min-h-[200px] flex flex-col">
            <textarea 
              readOnly 
              className={`w-full flex-1 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded dark:text-white ${isValidate ? 'text-green-600 font-bold' : ''}`} 
              value={out}
            ></textarea>
            <button 
              onClick={copyToClipboard}
              className={`absolute top-3 right-3 px-3 py-1.5 rounded text-xs font-medium transition-colors shadow-sm ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white'
              }`}
            >
              {copied ? "Copied! ✓" : "Copy to Clipboard"}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}