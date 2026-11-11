import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';

// Standard HTML text/attribute escaping: & < > " '
function htmlEncode(val) {
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function placeholderFor(path) {
  if (path.includes('html-dec')) return 'Paste HTML entities, e.g. &lt;b&gt;Tom &amp; Jerry&lt;/b&gt;';
  if (path.includes('html-enc')) return 'Paste text or markup to escape, e.g. <b>Tom & Jerry</b>';
  if (path.includes('url-dec')) return 'Paste a percent-encoded string…';
  if (path.includes('url-enc')) return 'Paste text to URL-encode…';
  if (path.includes('base64-dec')) return 'Paste a Base64 string…';
  if (path.includes('base64-enc')) return 'Paste text to Base64-encode…';
  return 'Input text…';
}

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
      else if (path.includes('html-enc')) setOut(htmlEncode(val));
      else if (path.includes('html-dec')) {
        const txt = document.createElement('textarea');
        txt.innerHTML = val;
        setOut(txt.value);
      }
    } catch (e) {
      setOut('');
    }
  };

  return (
    <ToolLayout title={path.replace('/', '').replace(/-/g, ' ').toUpperCase()} desc="Encode or decode text securely." path={path}>
      <div className="p-6 grid md:grid-cols-2 gap-4 h-[500px]">
        <textarea
          className="w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded"
          value={inp}
          onChange={(e) => process(e.target.value)}
          placeholder={placeholderFor(path)}
        />
        <OutputBox value={out} label="Output" placeholder="Decoded output appears here…" />
      </div>
    </ToolLayout>
  );
}
