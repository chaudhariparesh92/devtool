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
  const [urlPlusAsSpace, setUrlPlusAsSpace] = useState(false);
  const [urlRecursive, setUrlRecursive] = useState(false);
  const [urlPerLine, setUrlPerLine] = useState(true);
  const [urlError, setUrlError] = useState('');

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

  const processUrl = (value, options = {}) => {
    const plusAsSpace = options.plusAsSpace ?? urlPlusAsSpace;
    const recursive = options.recursive ?? urlRecursive;
    const perLine = options.perLine ?? urlPerLine;
    setInp(value);
    setUrlError('');

    const decodeValue = (raw) => {
      let current = plusAsSpace ? raw.replace(/\+/g, ' ') : raw;
      let passes = 0;
      do {
        const previous = current;
        current = decodeURIComponent(current);
        passes += 1;
        if (!recursive || current === previous || passes >= 16) break;
      } while (true);
      return current;
    };

    try {
      const result = perLine
        ? value.split(/\r?\n/).map((line) => decodeValue(line)).join('\n')
        : decodeValue(value);
      setOut(result);
    } catch (error) {
      setOut('');
      setUrlError(error instanceof URIError
        ? 'Unable to decode this value. Check that every % is followed by two hexadecimal digits and that the encoded bytes form valid UTF-8.'
        : 'The URL value could not be decoded. Check the input and try again.');
    }
  };

  if (path.includes('url-dec')) {
    const examples = [
      { label: 'Encoded text', value: 'Hello%2C%20world%21%20%F0%9F%91%8B' },
      { label: 'Query value', value: 'name=Jane%20Doe%26role=developer' },
      { label: 'UTF-8 text', value: 'caf%C3%A9%20au%20lait' },
      { label: 'Double encoded', value: 'hello%2520world' },
      { label: 'Form query', value: 'q=hello+world&category=web+tools' },
    ];

    return (
      <ToolLayout title="URL Decoder Online" desc="Decode percent-encoded URLs and query values into readable text." path={path}>
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg">Decode URL-encoded text</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Paste a percent-encoded URL, URI component or query value. The decoded result appears as you type.</p>
            </div>
            <button
              type="button"
              onClick={() => { setInp(''); setOut(''); setUrlError(''); }}
              disabled={!inp && !out && !urlError}
              className="px-3 py-2 text-sm rounded border hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="URL decoder examples">
            <span className="text-xs self-center mr-1" style={{ color: 'var(--muted)' }}>Try an example:</span>
            {examples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => { const plus = example.label === 'Form query' ? true : urlPlusAsSpace; const repeat = example.label === 'Double encoded' ? true : urlRecursive; if (example.label === 'Form query') setUrlPlusAsSpace(true); if (example.label === 'Double encoded') setUrlRecursive(true); processUrl(example.value, { plusAsSpace: plus, recursive: repeat }); }}
                className="px-3 py-1.5 text-xs rounded border hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={urlPlusAsSpace} onChange={(e) => { setUrlPlusAsSpace(e.target.checked); processUrl(inp, { plusAsSpace: e.target.checked }); }} className="rounded border-gray-400" />
              Treat + as space (form data)
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={urlRecursive} onChange={(e) => { setUrlRecursive(e.target.checked); processUrl(inp, { recursive: e.target.checked }); }} className="rounded border-gray-400" />
              Decode recursively (up to 16 passes)
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={urlPerLine} onChange={(e) => { setUrlPerLine(e.target.checked); processUrl(inp, { perLine: e.target.checked }); }} className="rounded border-gray-400" />
              Decode each line separately
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="min-w-0 space-y-2">
              <label htmlFor="url-decoder-input" className="block text-sm font-semibold">Encoded URL or text</label>
              <textarea
                id="url-decoder-input"
                className="w-full min-h-[260px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inp}
                onChange={(e) => processUrl(e.target.value)}
                placeholder="Paste encoded text, e.g. hello%20world%20%26%20welcome"
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
              />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Supports percent-encoded UTF-8. Input is processed locally in this browser.</p>
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-semibold">Decoded URL text</p>
              <OutputBox
                value={out}
                label="Decoded URL output"
                placeholder="Readable decoded text appears here…"
                textareaClassName="min-h-[260px]"
                downloadFilename="decoded-url.txt"
              />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>The output is text; decoding does not validate a URL or make a destination safe to open.</p>
            </div>
          </div>
          {urlError && <p role="alert" className="text-sm rounded border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-3">{urlError}</p>}
          <p className="text-xs" style={{ color: 'var(--muted)' }}>URL decoding is not decryption. Percent-encoded values are reversible and provide no protection for passwords, tokens or other sensitive data.</p>
        </div>
      </ToolLayout>
    );
  }

  if (path.includes('html-enc')) {
    const examples = [
      { label: 'HTML snippet', value: '<div class="note">Tom & Jerry</div>' },
      { label: 'Special characters', value: `5 < 10 && 10 > 5; "quoted" and 'apostrophe'` },
      { label: 'Code sample', value: '<script>alert("Hello")</script>' },
    ];

    return (
      <ToolLayout title="HTML Encoder Online" desc="Encode HTML special characters as entities so markup displays as text." path={path}>
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg">Encode HTML entities</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Paste text or markup. HTML special characters are escaped as you type.</p>
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

          <div className="flex flex-wrap gap-2" aria-label="HTML encoder examples">
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
              <label htmlFor="html-encoder-input" className="block text-sm font-semibold">Text or HTML input</label>
              <textarea
                id="html-encoder-input"
                className="w-full min-h-[260px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inp}
                onChange={(e) => process(e.target.value)}
                placeholder="Paste text or markup, e.g. <p>Tom & Jerry</p>"
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
              />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Escapes &, &lt;, &gt;, double quotes and apostrophes.</p>
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-semibold">Encoded HTML entities</p>
              <OutputBox
                value={out}
                label="Encoded HTML output"
                placeholder="Encoded entities appear here…"
                textareaClassName="min-h-[260px]"
                downloadFilename="encoded-html.txt"
              />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Output is plain text. Use it in the matching HTML text or quoted-attribute context.</p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Encoding runs in your browser. It is not a sanitizer and does not replace context-specific escaping in application code.</p>
        </div>
      </ToolLayout>
    );
  }

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
