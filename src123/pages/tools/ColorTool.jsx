import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function ColorTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');

  const process = (val) => {
    setInp(val);
    try {
      if (val.startsWith('#')) {
        let hex = val.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        setOut(`rgb(${r}, ${g}, ${b})`);
      } else if (val.startsWith('rgb')) {
        const match = val.match(/\d+/g);
        if (match && match.length >= 3) {
          const hex = "#" + match.slice(0,3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
          setOut(hex.toUpperCase());
        }
      } else {
        setOut('Unsupported format. Try #FFF, #FFFFFF, or rgb(255, 255, 255)');
      }
    } catch(e) { setOut(''); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Convert colors between HEX and RGB." path={path}>
      <div className="p-6 space-y-4">
        <input type="text" className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>process(e.target.value)} placeholder="e.g. #3B82F6 or rgb(59, 130, 246)" />
        <div className="flex items-center gap-4">
          <input type="text" readOnly className="flex-1 p-4 font-mono bg-indigo-50 dark:bg-indigo-900/20 rounded border" value={out} placeholder="Result" />
          {out && (out.startsWith('#') || out.startsWith('rgb')) && (
            <div className="w-16 h-16 rounded border shadow" style={{backgroundColor: out}}></div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}