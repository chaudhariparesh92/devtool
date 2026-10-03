import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(crypto.randomUUID());
    }
    setUuids(newUuids);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const copyAllToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error("Failed to copy all", err);
    }
  };

  return (
    <ToolLayout 
      title="UUID Generator" 
      description="Generate random UUID v4 strings instantly in your browser." 
      url="/uuid-generator"
      intro="Select how many UUIDs you need and click generate to create them instantly."
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
            <select 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))} 
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          
          <button 
            onClick={generate} 
            className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Generate UUIDs
          </button>

          {uuids.length > 0 && (
            <button 
              onClick={copyAllToClipboard} 
              className={`px-4 py-2 rounded font-medium transition-colors shadow-sm ${
                copiedAll 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white'
              }`}
            >
              {copiedAll ? "Copied All! ✓" : "Copy All"}
            </button>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Generated UUIDs ({uuids.length})
            </div>
            {uuids.map((u, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-sm rounded shadow-xs"
              >
                <span className="truncate mr-2 text-gray-800 dark:text-gray-200 select-all">{u}</span>
                <button
                  onClick={() => copyToClipboard(u, i)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                    copiedIndex === i 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {copiedIndex === i ? "Copied! ✓" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}