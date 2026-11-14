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

  if (path.includes('html-dec')) {
    const examples = [
      { label: 'Basic entities', value: '&lt;h1&gt;Tom &amp; Jerry&lt;/h1&gt;' },
      { label: 'Numeric entities', value: '&#169; &#38; &#60; &#62;' },
      { label: 'Hex entities', value: '&#xA9; &#x26; &#x3C; &#x3E;' },
      { label: 'Double encoded', value: '&amp;lt;div&amp;gt;' },
    ];

    return (
      <ToolLayout title="HTML Decoder Online" desc="Decode HTML entities into readable text and markup." path={path}>
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg">Decode HTML entities</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Paste encoded text. The decoded result updates as you type.</p>
            </div>
            <button
              type="button"
              onClick={() => { setInp(''); setOut(''); }}
              disabled={!inp && !out}
              className="px-3 py-2 text-sm rounded border hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="HTML decoder examples">
            <span className="text-xs self-center mr-1" style={{ color: 'var(--muted)' }}>Try an example:</span>
            {examples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => process(example.value)}
                className="px-3 py-1.5 text-xs rounded border hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="min-w-0 space-y-2">
              <label htmlFor="html-decoder-input" className="block text-sm font-semibold">Encoded HTML input</label>
              <textarea
                id="html-decoder-input"
                className="w-full min-h-[260px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inp}
                onChange={(e) => process(e.target.value)}
                placeholder="Paste entities such as &amp;lt;div&amp;gt;Hello&amp;lt;/div&amp;gt;"
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
              />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Accepts named, decimal and hexadecimal HTML character references.</p>
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-semibold">Decoded text</p>
              <OutputBox
                value={out}
                label="Decoded HTML output"
                placeholder="Decoded text and markup appear here…"
                textareaClassName="min-h-[260px]"
                downloadFilename="decoded-html.txt"
              />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Output is shown as text; decoded markup is not rendered or executed here.</p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Decoding runs in your browser. It reverses HTML character references but does not sanitize untrusted markup.</p>
        </div>
      </ToolLayout>
    );
  }

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
