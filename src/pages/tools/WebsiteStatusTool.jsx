import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToolLayout from '../../components/ToolLayout';
import CopyButton from '../../components/CopyButton';
import DownloadButton from '../../components/DownloadButton';
import { MAX_TARGETS, checkSite, formatResultsText, parseTargets } from '../../utils/siteCheck';

// Colour is never the only signal: every status also has a glyph and a text label.
const STATUS_STYLES = {
  up: { glyph: '\u2713', box: 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20', badge: 'text-green-700 dark:text-green-300' },
  reachable: { glyph: '\u2713', box: 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20', badge: 'text-green-700 dark:text-green-300' },
  responding: { glyph: '!', box: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20', badge: 'text-amber-700 dark:text-amber-300' },
  'server-error': { glyph: '!', box: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20', badge: 'text-amber-700 dark:text-amber-300' },
  unreachable: { glyph: '\u2715', box: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20', badge: 'text-red-700 dark:text-red-300' },
  timeout: { glyph: '\u2715', box: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20', badge: 'text-red-700 dark:text-red-300' },
  invalid: { glyph: '\u2013', box: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900', badge: 'text-gray-700 dark:text-gray-300' },
  untestable: { glyph: '\u2013', box: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900', badge: 'text-gray-700 dark:text-gray-300' },
};

// Results after which the "what to try next" help is useful.
const NEEDS_HELP = new Set(['unreachable', 'timeout', 'server-error']);

export default function WebsiteStatusTool({ path }) {
  const [inp, setInp] = useState('');
  const [results, setResults] = useState([]);
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState('');
  const abortRef = useRef(null);
  const runRef = useRef(0);

  // Cancel any in-flight checks when leaving the page.
  useEffect(() => () => abortRef.current?.abort(), []);

  const run = async () => {
    const { targets, truncated } = parseTargets(inp);
    if (targets.length === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const runId = ++runRef.current;

    setNote(truncated ? `Only the first ${MAX_TARGETS} addresses were checked.` : '');
    setResults([]);
    setChecking(true);

    const finished = await Promise.all(targets.map((t) => checkSite(t, controller.signal)));
    if (runId !== runRef.current) return; // a newer run or Clear replaced this one
    setResults(finished);
    setChecking(false);
  };

  const clear = () => {
    abortRef.current?.abort();
    runRef.current += 1;
    setInp('');
    setResults([]);
    setNote('');
    setChecking(false);
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !checking) run();
  };

  const showHelp = !checking && results.some((r) => NEEDS_HELP.has(r.status));

  return (
    <ToolLayout
      title="Website Status Checker"
      desc="Check whether a website or URL is up and reachable from your browser. Enter a domain name like example.com, or a full address with a path."
      path={path}
    >
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="site-input" className="block text-sm font-bold mb-2">
            Domain names or URLs (one per line, up to {MAX_TARGETS})
          </label>
          <textarea
            id="site-input"
            className="w-full h-28 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={inp}
            onChange={(e) => setInp(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={'example.com\nhttps://example.com/some/path'}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={run}
            disabled={checking || !inp.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {checking ? 'Checking\u2026' : 'Check status'}
          </button>
          <button
            type="button"
            onClick={clear}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear
          </button>
          <div className="ml-auto flex gap-2">
            <CopyButton
              text={results.length ? formatResultsText(results) : ''}
              label="Copy results"
            />
            <DownloadButton
              text={results.length ? formatResultsText(results) : ''}
              filename="website-status-results.txt"
              label="Download"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tip: press Ctrl+Enter (or Cmd+Enter) to run the check. Without https:// or http://, https:// is used.
        </p>

        <div aria-live="polite" className="space-y-3">
          {note && <p className="text-sm text-amber-700 dark:text-amber-300">{note}</p>}
          {results.map((r, i) => {
            const s = STATUS_STYLES[r.status] || STATUS_STYLES.invalid;
            return (
              <div key={`${r.url}-${i}`} className={`p-4 border rounded ${s.box}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-sm break-all">{r.url}</span>
                  <span className={`font-bold ${s.badge}`}>
                    <span aria-hidden="true">{s.glyph} </span>
                    {r.label}
                    {r.httpStatus ? ` (HTTP ${r.httpStatus})` : ''}
                  </span>
                </div>
                {r.detail && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{r.detail}</p>}
                {r.finalUrl && r.finalUrl !== r.url && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 break-all">Redirected to: {r.finalUrl}</p>
                )}
                {r.ms != null && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Response time: about {r.ms} ms (time until the server answered)</p>
                )}
              </div>
            );
          })}

          {showHelp && (
            <div className="p-4 text-sm border rounded bg-gray-50 dark:bg-gray-900 space-y-2">
              <p className="font-bold">Is it down for everyone or just you? Try this next</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Check the spelling of the address, and that it uses https://.</li>
                <li>Open the same address on another network, such as mobile data, or on another device.</li>
                <li>Turn off any VPN, proxy or ad blocker, then check again.</li>
                <li>Clear your DNS cache, or switch to another DNS resolver.</li>
              </ol>
              <p>
                If it loads on another network, the problem is on your side. If it fails everywhere, the site or its host is probably down.{' '}
                <Link to="/guides/check-if-a-website-is-down" className="a-link">Read the step-by-step guide</Link>.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 text-sm bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded space-y-2">
          <p>
            <strong>How this check works:</strong> your browser sends a lightweight HEAD request directly to the address you enter. Nothing is sent to our servers, but the site you check will see a request from your IP address.
          </p>
          <p>
            <strong>Limits:</strong> the result reflects what <em>your</em> browser and network can reach, not a worldwide uptime measurement. A site that is down for others may load for you, and the reverse. If a site does not allow browsers to read its response, we can confirm it answered but not its HTTP status code.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
