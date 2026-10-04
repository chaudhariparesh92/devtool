import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
export default function TextTools({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');

  const process = (val) => {
    setInp(val);
    if (!val) return setOut('');
    if (path.includes('counter')) {
      const words = val.trim().split(/\s+/).filter(w=>w.length>0).length;
      setOut(`Characters: ${val.length}\nWords: ${words}\nLines: ${val.split('\n').length}`);
    } else if (path.includes('case')) {
      setOut(`UPPERCASE:\n${val.toUpperCase()}\n\nlowercase:\n${val.toLowerCase()}\n\nTitle Case:\n${val.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}`);
    } else if (path.includes('slug')) {
      setOut(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Text manipulation tools." path={path}>
      <div className="p-6 grid md:grid-cols-2 gap-4 h-[400px]">
        <textarea className="w-full h-full p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={inp} onChange={e=>process(e.target.value)} placeholder="Enter text..."></textarea>
        <OutputBox value={out} label="Output" placeholder="Output..." className="h-full" textareaClassName="whitespace-pre-wrap" />
      </div>
    </ToolLayout>
  );
}