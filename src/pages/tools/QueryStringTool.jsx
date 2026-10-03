import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function QueryStringTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const isParse = path.includes('parser');

  const process = () => {
    try {
      if (isParse) {
        const urlParams = new URLSearchParams(inp.replace(/^.*\?/, ''));
        const obj = Object.fromEntries(urlParams.entries());
        setOut(JSON.stringify(obj, null, 2));
      } else {
        const obj = JSON.parse(inp);
        const urlParams = new URLSearchParams(obj);
        setOut(urlParams.toString());
      }
    } catch(e) { setOut('Error processing input.'); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Parse and generate URL query strings." path={path}>
      <div className="p-6 grid md:grid-cols-2 gap-4 h-[400px]">
        <div className="flex flex-col gap-4">
          <textarea className="w-full flex-1 p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={inp} onChange={e=>setInp(e.target.value)} placeholder={isParse ? "?key=value&a=b" : '{"key": "value", "a": "b"}'}></textarea>
          <button onClick={process} className="px-6 py-2 bg-indigo-600 text-white rounded">{isParse ? 'Parse' : 'Generate'}</button>
        </div>
        <textarea readOnly className="w-full h-full p-4 font-mono text-sm bg-indigo-50 dark:bg-indigo-900/20 border rounded" value={out}></textarea>
      </div>
    </ToolLayout>
  );
}