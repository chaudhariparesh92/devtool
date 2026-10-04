import { useEffect, useRef, useState } from 'react';
import { copyText } from '../utils/clipboard';

// Reusable "copy to clipboard" button with a "Copied!" confirmation.
// Disabled automatically when there is nothing to copy.
export default function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied! \u2713',
  className = '',
  disabled = false,
}) {
  const [state, setState] = useState('idle'); // 'idle' | 'copied' | 'failed'
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = async () => {
    const ok = await copyText(text);
    setState(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  };

  const colors =
    state === 'copied'
      ? 'bg-green-600 text-white'
      : state === 'failed'
        ? 'bg-red-600 text-white'
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || !text}
        className={`px-3 py-1.5 rounded text-xs font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${colors} ${className}`}
      >
        {state === 'copied' ? copiedLabel : state === 'failed' ? 'Copy failed' : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'copied' ? 'Copied to clipboard' : state === 'failed' ? 'Copy failed' : ''}
      </span>
    </>
  );
}
