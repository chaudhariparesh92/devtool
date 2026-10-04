import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import * as Diff from 'diff';
import CopyButton from '../../components/CopyButton';

export default function DiffTool({ path }) {
  const [t1, setT1] = useState('');
  const [t2, setT2] = useState('');
  const [diffRes, setDiffRes] = useState([]);

  const compare = () => {
    const diff = Diff.diffLines(t1, t2);
    setDiffRes(diff);
  };

  // Plain-text version of the result: "+ " added, "- " removed, "  " unchanged.
  const diffText = diffRes
    .map((part) => {
      const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
      return part.value.replace(/\n$/, '').split('\n').map((l) => prefix + l).join('\n');
    })
    .join('\n');

  return (
    <ToolLayout title="Diff Checker" desc="Compare two texts and find differences." path={path}>
      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <textarea className="w-full h-48 p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={t1} onChange={e=>setT1(e.target.value)} placeholder="Original text..."></textarea>
          <textarea className="w-full h-48 p-4 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900" value={t2} onChange={e=>setT2(e.target.value)} placeholder="Modified text..."></textarea>
        </div>
        <button onClick={compare} className="w-full px-6 py-2 bg-indigo-600 text-white rounded font-bold">Compare</button>
        <div className="flex justify-end">
          <CopyButton text={diffText} label="Copy diff" />
        </div>
        <div className="p-4 border rounded bg-white dark:bg-gray-900 min-h-[100px] whitespace-pre-wrap font-mono text-sm">
          {diffRes.map((part, i) => (
            <span key={i} className={part.added ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : part.removed ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}>
              {part.value}
            </span>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}