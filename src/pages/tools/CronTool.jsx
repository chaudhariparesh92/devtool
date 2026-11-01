import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import cronstrue from 'cronstrue';
import OutputBox from '../../components/OutputBox';

const PRESETS = [
  ['Every minute', '* * * * *'],
  ['Every 5 minutes', '*/5 * * * *'],
  ['Every hour', '0 * * * *'],
  ['Daily at midnight', '0 0 * * *'],
  ['Weekdays at 9:00', '0 9 * * 1-5'],
  ['Mondays at 8:30', '30 8 * * 1'],
  ['1st of the month', '0 0 1 * *'],
];

export default function CronTool({ path }) {
  const [inp, setInp] = useState('* * * * *');
  const [out, setOut] = useState('');

  const parse = (val) => {
    setInp(val);
    try {
      setOut(cronstrue.toString(val));
    } catch(e) { setOut('Invalid Cron Expression'); }
  };

  const shown = out || cronstrue.toString('* * * * *');
  const invalid = out === 'Invalid Cron Expression';

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Translate and build cron expressions." path={path}>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">Cron Expression</label>
          <input type="text" className="w-full p-4 font-mono text-xl bg-gray-50 dark:bg-gray-900 border rounded text-center" value={inp} onChange={e=>parse(e.target.value)} />
        </div>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Common schedules">
          {PRESETS.map(([label, expr]) => (
            <button key={expr} type="button" onClick={() => parse(expr)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border rounded hover:bg-gray-200 dark:hover:bg-gray-700">{label}</button>
          ))}
        </div>
        <OutputBox value={shown} label="Cron description" placeholder="Description" downloadFilename="cron-description.txt" textareaClassName="h-24 text-center text-xl font-bold" copyDisabled={invalid} />
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => parse('* * * * *')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Reset example</button>
          <button type="button" onClick={() => { setInp(''); setOut(''); }} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Clear</button>
        </div>
      </div>
    </ToolLayout>
  );
}