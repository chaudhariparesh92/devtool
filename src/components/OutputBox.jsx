import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';

// Read-only output textarea with a Copy button overlaid in the top-right corner.
// Layout-neutral: pass the same sizing classes the plain textarea used.
export default function OutputBox({
  value,
  label = 'Output',
  placeholder = 'Output...',
  className = '',
  textareaClassName = '',
  copyDisabled = false,
  downloadFilename = 'output.txt',
}) {
  return (
    <div className={`relative flex ${className}`}>
      <textarea
        readOnly
        aria-label={label}
        value={value}
        placeholder={placeholder}
        className={`w-full flex-1 min-w-0 p-4 pr-24 font-mono text-sm rounded border bg-indigo-50 dark:bg-indigo-900/20 dark:text-white ${textareaClassName}`}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <CopyButton text={value} disabled={copyDisabled} />
        <DownloadButton text={value} filename={downloadFilename} />
      </div>
    </div>
  );
}
