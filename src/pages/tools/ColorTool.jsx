import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import { convertColor } from '../../utils/color';

export default function ColorTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');

  const process = (val) => {
    setInp(val);
    const res = convertColor(val);
    if (res.empty) setOut('');
    else if (res.error) setOut(res.error);
    else setOut(res.value);
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Convert colors between HEX and RGB." path={path}>
      <div className="p-6 space-y-4">
        <input type="text" className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>process(e.target.value)} placeholder="e.g. #3B82F6, rgb(59, 130, 246) or 59, 130, 246" />
        <div className="flex items-center gap-4">
          <OutputBox value={out} label="Converted color" placeholder="Result" downloadFilename="color-result.txt" className="flex-1 min-w-0" textareaClassName="h-16" copyDisabled={!(out.startsWith('#') || out.startsWith('rgb'))} />
          {out && (out.startsWith('#') || out.startsWith('rgb')) && (
            <div aria-label="Color preview" className="w-16 h-16 rounded border shadow shrink-0" style={{backgroundColor: out}}></div>
          )}
        </div>
        <button type="button" onClick={() => { setInp(''); setOut(''); }} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Clear</button>
      </div>
    </ToolLayout>
  );
}