import { useRef, useState } from 'react';

export default function FileDropZone({ onFile, accept, label = 'Drop a file here or choose one', className = '' }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const choose = () => inputRef.current?.click();
  const handle = (file) => file && onFile(file);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files?.[0]); }}
      className={`rounded border-2 border-dashed p-4 text-center text-sm transition-colors ${over ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700'} ${className}`}
    >
      <button type="button" onClick={choose} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">{label}</button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
    </div>
  );
}
