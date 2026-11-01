// Pure colour parsing/formatting helpers used by ColorTool. No React, no side effects.
const clampOk = (n) => Number.isInteger(n) && n >= 0 && n <= 255;
const h2 = (n) => n.toString(16).padStart(2, '0').toUpperCase();

// Returns { kind: 'hex'|'rgb', value } or { error }.
export function convertColor(raw) {
  const val = String(raw ?? '').trim();
  if (!val) return { empty: true };

  // HEX input: #RGB, #RGBA, #RRGGBB, #RRGGBBAA (the # is optional)
  const hexMatch = val.match(/^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hexMatch && (val.startsWith('#') || hexMatch[1].length >= 6)) {
    let hex = hexMatch[1];
    if (hex.length <= 4) hex = hex.split('').map((c) => c + c).join('');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (hex.length === 8) {
      const a = Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100) / 100;
      return { kind: 'rgb', value: `rgba(${r}, ${g}, ${b}, ${a})` };
    }
    return { kind: 'rgb', value: `rgb(${r}, ${g}, ${b})` };
  }

  // RGB input: rgb(59, 130, 246), rgba(59,130,246,0.5), 59, 130, 246 or 59 130 246
  const body = val.replace(/^rgba?\s*\(/i, '').replace(/\)\s*;?$/, '');
  const parts = body.split(/[\s,\/]+/).filter(Boolean);
  if (parts.length >= 3 && parts.length <= 4 && parts.slice(0, 3).every((p) => /^\d+$/.test(p))) {
    const [r, g, b] = parts.slice(0, 3).map(Number);
    if (![r, g, b].every(clampOk)) return { error: 'Each RGB value must be a whole number from 0 to 255.' };
    let hex = `#${h2(r)}${h2(g)}${h2(b)}`;
    if (parts.length === 4) {
      let a = parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
      if (!(a >= 0 && a <= 1)) return { error: 'Alpha must be between 0 and 1.' };
      hex += h2(Math.round(a * 255));
    }
    return { kind: 'hex', value: hex };
  }
  return { error: 'Unsupported format. Try #FFF, #FFFFFF, rgb(255, 255, 255) or 255, 255, 255.' };
}
