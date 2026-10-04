import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
export default function EncoderTool({ path }) {
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');

  const process = (val) => {
    setInp(val);
    try {
      if (path.includes('base64-enc')) setOut(btoa(unescape(encodeURIComponent(val))));
      else if (path.includes('base64-dec')) setOut(decodeURIComponent(escape(atob(val))));
      else if (path.includes('url-enc')) setOut(encodeURIComponent(val));
      else if (path.includes('url-dec')) setOut(decodeURIComponent(val));
      else if (path.includes('html-enc')) setOut(val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      else if (path.includes('html-dec')) {
        const txt = document.createElement("textarea");
        txt.innerHTML = val;
        setOut(txt.value);
      }
    } catch (e) { setOut(''); }
  };

  return (
    <ToolLayout title={path.replace('/','').replace(/-/g, ' ').toUpperCase()} desc="Encode or decode text securely." path={path}>
      <div className="p-6 grid md:grid-cols-2 gap-4 h-[500px]">
        <textarea className="w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded" value={inp} onChange={e=>process(e.target.value)} placeholder="Input text..."></textarea>
        <textarea readOnly className="w-full p-4 font-mono text-sm bg-indigo-50 dark:bg-indigo-900/20 border rounded" value={out} placeholder="Output..."></textarea>
      </div>
    </ToolLayout>
  );
}