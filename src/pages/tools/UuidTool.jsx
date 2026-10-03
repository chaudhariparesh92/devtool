import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
export default function UuidTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const isGen = path.includes('generator');
  const isVal = path.includes('validator');
  const isPar = path.includes('parser');
  
  const generate = () => {
    let res = [];
    for(let i=0; i<10; i++) res.push(crypto.randomUUID());
    setOut(res.join('\n'));
  };

  const validateOrParse = () => {
    const r = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isValid = r.test(inp.trim());
    if (isVal) {
      setOut(isValid ? 'Valid UUID' : 'Invalid UUID');
    } else if (isPar) {
      if (!isValid) return setOut('Invalid UUID to parse.');
      const v = inp.trim().charAt(14);
      setOut(`Version: ${v}\nVariant: RFC 4122 (Leach-Salz)`);
    }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="UUID utility tools." path={path}>
      <div className="p-6 flex flex-col items-center gap-6">
        {isGen ? (
          <>
            <button onClick={generate} className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold">Generate UUIDs</button>
            <textarea readOnly className="w-full max-w-2xl h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded text-center" value={out}></textarea>
          </>
        ) : (
          <div className="w-full max-w-2xl space-y-4">
            <input type="text" className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>setInp(e.target.value)} placeholder="Enter UUID..." />
            <button onClick={validateOrParse} className="px-6 py-2 bg-indigo-600 text-white rounded">Process</button>
            {out && <div className={`p-4 font-bold border rounded ${out.includes('Valid') || out.includes('Version') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}><pre>{out}</pre></div>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}