import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

export default function UuidTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [count, setCount] = useState(10);

  const isGen = path.includes('generator');
  const isVal = path.includes('validator');
  const isPar = path.includes('parser');
  
  const generate = () => {
    let res = [];
    for (let i = 0; i < count; i++) {
      res.push(crypto.randomUUID());
    }
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
          <div className="w-full max-w-2xl space-y-4 flex flex-col items-center">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <label className="font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
              <select 
                value={count} 
                onChange={(e) => setCount(Number(e.target.value))} 
                className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <button 
                onClick={generate} 
                className="px-6 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 transition-colors"
              >
                Generate UUIDs
              </button>
            </div>

            {out && (
              <OutputBox value={out} label="Generated UUIDs" className="w-full h-64 mt-2" textareaClassName="text-left" />
            )}
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-4">
            <input 
              type="text" 
              className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded dark:text-white" 
              value={inp} 
              onChange={e => setInp(e.target.value)} 
              placeholder="Enter UUID..." 
            />
            <button onClick={validateOrParse} className="px-6 py-2 bg-indigo-600 text-white rounded">Process</button>
            {out && (
              <div className={`relative p-4 pr-24 font-bold border rounded ${out.includes('Valid') || out.includes('Version') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <pre>{out}</pre>
                <CopyButton text={out} className="absolute top-2 right-2" />
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}