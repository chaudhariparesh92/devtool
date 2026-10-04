import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import CryptoJS from 'crypto-js';

export default function HashTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');

  const generate = (val) => {
    setInp(val);
    if (!val) return setOut('');
    if (path.includes('md5')) setOut(CryptoJS.MD5(val).toString());
    else if (path.includes('sha256')) setOut(CryptoJS.SHA256(val).toString());
    else if (path.includes('sha512')) setOut(CryptoJS.SHA512(val).toString());
    else setOut(CryptoJS.SHA256(val).toString());
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Generate cryptographic hashes locally." path={path}>
      <div className="p-6 space-y-4">
        <textarea className="w-full p-4 font-mono bg-gray-50 dark:bg-gray-900 border rounded min-h-[150px]" value={inp} onChange={e=>generate(e.target.value)} placeholder="String to hash..." />
        {out && <div className="p-4 font-mono bg-indigo-50 dark:bg-indigo-900/20 rounded border break-all text-xl">{out}</div>}
      </div>
    </ToolLayout>
  );
}