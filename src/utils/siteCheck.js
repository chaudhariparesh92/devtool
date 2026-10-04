// Browser-only website reachability check.
//
// How it works (no backend, no third-party API):
//  1. Try a CORS-mode HEAD request. If the target allows it, we can read the
//     real HTTP status code.
//  2. Otherwise fall back to a no-cors HEAD request. The response is opaque
//     (status hidden), but if it resolves the server answered; if it rejects,
//     the browser could not connect (DNS failure, refused, TLS error, blocked...).
//
// Limits: this tests reachability from the *user's* browser/network only.

export const MAX_TARGETS = 10;
export const TIMEOUT_MS = 12000;

const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;

export function isLoopbackHost(hostname) {
  return (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    /^127\./.test(hostname) ||
    hostname === '[::1]'
  );
}

// Turns "example.com", "example.com/path" or "https://example.com/path?x=1"
// into a normalised target, or an { error } object.
export function parseTarget(raw) {
  const input = String(raw ?? '').trim();
  if (!input) return { input, error: 'Nothing to check.' };

  const candidate = SCHEME_RE.test(input) ? input : `https://${input}`;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    return { input, error: 'This is not a valid domain name or URL.' };
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { input, error: 'Only http:// and https:// addresses can be checked.' };
  }
  if (url.username || url.password) {
    return { input, error: 'Addresses containing a username or password are not supported.' };
  }
  const host = url.hostname;
  const looksLikeHost = host.includes('.') || host.startsWith('[') || isLoopbackHost(host);
  if (!looksLikeHost) {
    return { input, error: 'Add a top-level domain, for example "example.com".' };
  }

  return { input, url: url.href, host, protocol: url.protocol };
}

// Splits textarea input into unique targets (max MAX_TARGETS).
export function parseTargets(text) {
  const seen = new Set();
  const lines = String(text ?? '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => {
      const key = l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return {
    targets: lines.slice(0, MAX_TARGETS).map(parseTarget),
    truncated: lines.length > MAX_TARGETS,
  };
}

function fetchOptions(mode, signal) {
  return {
    method: 'HEAD',
    mode,
    cache: 'no-store',
    credentials: 'omit',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    signal,
  };
}

function classifyHttp(res, ms) {
  const code = res.status;
  const text = `${code}${res.statusText ? ' ' + res.statusText : ''}`;
  const finalUrl = res.redirected && res.url ? res.url : null;
  if (code >= 500) {
    return {
      status: 'server-error', label: 'Server error', httpStatus: code, ms, finalUrl,
      detail: `The server responded with HTTP ${text}. The site is reachable but reporting a problem.`,
    };
  }
  if (code >= 400) {
    return {
      status: 'responding', label: 'Online (client error)', httpStatus: code, ms, finalUrl,
      detail: `The server responded with HTTP ${text}. The site is online, but this address returned an error (for example page not found, access denied, or HEAD not allowed).`,
    };
  }
  return {
    status: 'up', label: 'Up', httpStatus: code, ms, finalUrl,
    detail: `The server responded with HTTP ${text}.`,
  };
}

// Checks one parsed target. Never throws. parentSignal lets the caller cancel.
export async function checkSite(target, parentSignal) {
  const base = { input: target.input, url: target.url || target.input };

  if (target.error) {
    return { ...base, status: 'invalid', label: 'Invalid input', detail: target.error };
  }
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    target.protocol === 'http:' &&
    !isLoopbackHost(target.host)
  ) {
    return {
      ...base, status: 'untestable', label: 'Cannot be tested',
      detail: 'Browsers block http:// requests made from an https:// page. Try the https:// address instead.',
    };
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, TIMEOUT_MS);
  const onParentAbort = () => controller.abort();
  parentSignal?.addEventListener('abort', onParentAbort, { once: true });

  try {
    const started = performance.now();
    try {
      const res = await fetch(target.url, fetchOptions('cors', controller.signal));
      return { ...base, ...classifyHttp(res, Math.round(performance.now() - started)) };
    } catch (err) {
      // CORS blocked or network failure: both look the same. Timeouts/cancels stop here.
      if (controller.signal.aborted) throw err;
    }

    const startedNoCors = performance.now();
    await fetch(target.url, fetchOptions('no-cors', controller.signal));
    return {
      ...base, status: 'reachable', label: 'Reachable', httpStatus: null,
      ms: Math.round(performance.now() - startedNoCors), finalUrl: null,
      detail: 'The server responded. This site does not allow your browser to read the HTTP status code, so only reachability can be confirmed.',
    };
  } catch {
    if (parentSignal?.aborted) return { ...base, status: 'cancelled', label: 'Cancelled', detail: '' };
    if (timedOut) {
      return {
        ...base, status: 'timeout', label: 'Timed out',
        detail: `No response within ${TIMEOUT_MS / 1000} seconds. The site may be down or very slow.`,
      };
    }
    return {
      ...base, status: 'unreachable', label: 'Unreachable',
      detail: 'Your browser could not connect. The site may be down, the domain may not exist, the TLS certificate may be invalid, or something on your network (VPN, firewall, DNS, ad blocker) may be blocking the request.',
    };
  } finally {
    clearTimeout(timer);
    parentSignal?.removeEventListener('abort', onParentAbort);
  }
}

// Plain-text summary used by the Copy button.
export function formatResultsText(results) {
  const lines = results.map((r) => {
    const code = r.httpStatus ? ` (HTTP ${r.httpStatus})` : '';
    const time = r.ms != null ? ` - ${r.ms} ms` : '';
    return `${r.url} - ${r.label}${code}${time}`;
  });
  return [`Checked from my browser at ${new Date().toISOString()}`, ...lines].join('\n');
}
