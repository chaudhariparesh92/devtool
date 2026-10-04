import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import cronstrue from 'cronstrue';

export default function CronTool({ path }) {
  const [inp, setInp] = useState('* * * * *');
  const [out, setOut] = useState('');

  const parse = (val) => {
    setInp(val);
    try {
      setOut(cronstrue.toString(val));
    } catch(e) { setOut('Invalid Cron Expression'); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Translate and build cron expressions." path={path}>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">Cron Expression</label>
          <input type="text" className="w-full p-4 font-mono text-xl bg-gray-50 dark:bg-gray-900 border rounded text-center" value={inp} onChange={e=>parse(e.target.value)} />
        </div>
        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded text-center text-xl font-bold text-indigo-700 dark:text-indigo-300">
          {out || cronstrue.toString('* * * * *')}
        </div>
      </div>
    </ToolLayout>
  );
}