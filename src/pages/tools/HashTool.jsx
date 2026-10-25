import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import CryptoJS from 'crypto-js';
import OutputBox from '../../components/OutputBox';

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
        {out && (
          <OutputBox value={out} label="Generated hash" placeholder="Hash output" downloadFilename={`${path.split('/').pop()}.txt`} textareaClassName="break-all text-xl" />
        )}
      </div>
    </ToolLayout>
  );
}