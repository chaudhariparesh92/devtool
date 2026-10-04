// Copies text to the clipboard. Uses the async Clipboard API when available
// (HTTPS / localhost) and falls back to a hidden textarea + execCommand for
// insecure contexts and older browsers. Resolves to true on success.
export async function copyText(text) {
  const value = String(text ?? '');

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Permission denied or document not focused: try the fallback below.
    }
  }

  const previouslyFocused = document.activeElement;
  const ta = document.createElement('textarea');
  ta.value = value;
  ta.setAttribute('readonly', '');
  ta.setAttribute('aria-hidden', 'true');
  ta.style.position = 'fixed';
  ta.style.top = '-1000px';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  try {
    ta.select();
    ta.setSelectionRange(0, value.length);
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
  }
}
