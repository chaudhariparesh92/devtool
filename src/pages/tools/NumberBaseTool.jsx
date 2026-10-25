import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';

export default function NumberBaseTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);

  const convert = (val, fb, tb) => {
    setInp(val);
    try {
      if (!val) return setOut('');
      const parsed = parseInt(val, fb);
      if (isNaN(parsed)) throw new Error();
      setOut(parsed.toString(tb).toUpperCase());
    } catch(e) { setOut('Invalid number for base ' + fb); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Convert numbers across different bases." path={path}>
      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-sm">From Base</label>
            <select className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900" value={fromBase} onChange={e=>{setFromBase(parseInt(e.target.value)); convert(inp, parseInt(e.target.value), toBase);}}>
              <option value={2}>Binary (2)</option><option value={8}>Octal (8)</option><option value={10}>Decimal (10)</option><option value={16}>Hex (16)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm">To Base</label>
            <select className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-900" value={toBase} onChange={e=>{setToBase(parseInt(e.target.value)); convert(inp, fromBase, parseInt(e.target.value));}}>
              <option value={2}>Binary (2)</option><option value={8}>Octal (8)</option><option value={10}>Decimal (10)</option><option value={16}>Hex (16)</option>
            </select>
          </div>
        </div>
        <input type="text" className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>convert(e.target.value, fromBase, toBase)} placeholder="Enter number..." />
        <OutputBox value={out} label="Converted number" placeholder="Result" downloadFilename="number-conversion.txt" textareaClassName="h-16" copyDisabled={out.startsWith('Invalid')} />
        <button type="button" onClick={() => { setInp(''); setOut(''); }} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Clear</button>
      </div>
    </ToolLayout>
  );
}