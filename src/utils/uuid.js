// Pure UUID helpers used by UuidTool. No React.
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL = '00000000-0000-0000-0000-000000000000';
const MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

export function formatUuid(u, fmt) {
  if (fmt === 'upper') return u.toUpperCase();
  if (fmt === 'nohyphen') return u.replace(/-/g, '');
  if (fmt === 'braces') return `{${u}}`;
  return u;
}

export function variantOf(u) {
  const c = parseInt(u.charAt(19), 16);
  if (c < 8) return 'NCS backward compatibility (variant 0)';
  if (c < 12) return 'RFC 4122 / RFC 9562 (variant 1)';
  if (c < 14) return 'Microsoft GUID (variant 2)';
  return 'Reserved for future use (variant 3)';
}

// Returns a validation result: { ok, label }.
export function validateUuid(raw) {
  const v = String(raw ?? '').trim().replace(/^\{|\}$/g, '');
  if (!UUID_RE.test(v)) return { ok: false, label: 'Invalid UUID' };
  const lower = v.toLowerCase();
  if (lower === NIL) return { ok: true, label: 'Valid UUID (nil UUID, all zeros)' };
  if (lower === MAX) return { ok: true, label: 'Valid UUID (max UUID, all ones)' };
  const ver = parseInt(v.charAt(14), 16);
  const c = parseInt(v.charAt(19), 16);
  if (c >= 8 && c < 12 && ver >= 1 && ver <= 8) return { ok: true, label: `Valid UUID (version ${ver})` };
  return { ok: false, label: 'Invalid UUID: the version or variant digit is not a standard value.' };
}

export function parseUuid(raw) {
  const v = String(raw ?? '').trim().replace(/^\{|\}$/g, '');
  if (!UUID_RE.test(v)) return 'Invalid UUID to parse.';
  const lower = v.toLowerCase();
  if (lower === NIL) return 'Type: nil UUID (all zeros)\nVersion: none\nTimestamp: none';
  if (lower === MAX) return 'Type: max UUID (all ones)\nVersion: none\nTimestamp: none';
  const ver = parseInt(v.charAt(14), 16);
  const hex = v.replace(/-/g, '');
  const lines = [`Version: ${ver}`, `Variant: ${variantOf(v)}`];
  let ts = 'Timestamp: none (this version carries no creation time)';
  const iso = (ms) => (Number.isFinite(ms) && Math.abs(ms) < 8.64e15 ? new Date(ms).toISOString() : null);
  if (ver === 7) {
    const ms = parseInt(hex.slice(0, 12), 16);
    const d = iso(ms);
    ts = d ? `Timestamp: ${d} (Unix ms ${ms})` : 'Timestamp: out of range';
  } else if (ver === 1 || ver === 6) {
    const timeHigh = hex.slice(13, 16); // time_hi without the version nibble
    let ticks;
    if (ver === 1) ticks = BigInt('0x' + timeHigh + hex.slice(8, 12) + hex.slice(0, 8));
    else ticks = BigInt('0x' + hex.slice(0, 8) + hex.slice(8, 12) + timeHigh);
    const ms = Number(ticks / 10000n) - 12219292800000;
    const d = iso(ms);
    ts = d ? `Timestamp: ${d}` : 'Timestamp: out of range';
  }
  const notes = { 3: 'Name-based (MD5 hash)', 4: 'Random', 5: 'Name-based (SHA-1 hash)', 7: 'Time-ordered random', 1: 'Time-based', 6: 'Reordered time-based', 8: 'Custom / vendor-defined' };
  if (notes[ver]) lines.push(`Kind: ${notes[ver]}`);
  lines.push(ts);
  return lines.join('\n');
}
