import { useState, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function TimestampTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');

  useEffect(() => {
    setInp(Math.floor(Date.now() / 1000).toString());
  }, []);

  useEffect(() => {
    try {
      if (!inp) { setOut(''); return; }
      let d;
      if (/^\d+$/.test(inp)) {
        d = new Date(parseInt(inp) * (inp.length > 11 ? 1 : 1000));
      } else {
        d = new Date(inp);
      }
      if (isNaN(d.getTime())) throw new Error();
      setOut(`UTC: ${d.toUTCString()}\nLocal: ${d.toString()}\nISO: ${d.toISOString()}\nUnix (ms): ${d.getTime()}\nUnix (s): ${Math.floor(d.getTime()/1000)}`);
    } catch(e) { setOut('Invalid Date / Timestamp'); }
  }, [inp]);

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Convert timestamps to dates and vice versa." path={path}>
      <div className="p-6 space-y-4">
        <input type="text" className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Enter Unix timestamp or date string..." />
        <textarea readOnly className="w-full h-48 p-4 font-mono bg-indigo-50 dark:bg-indigo-900/20 rounded border break-all" value={out}></textarea>
      </div>
    </ToolLayout>
  );
}