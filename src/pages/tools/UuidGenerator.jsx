import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);

  const generate = () => {
    const newUuids = [];
    for(let i=0; i<count; i++){
      newUuids.push(crypto.randomUUID());
    }
    setUuids(newUuids);
  };

  return (
    <ToolLayout 
      title="UUID Generator" 
      description="Generate random UUID v4 strings instantly in your browser." 
      url="/uuid-generator"
      intro="Quickly generate one or multiple universally unique identifiers (UUIDs)."
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <label className="font-medium">Count:</label>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="50">50</option>
          </select>
          <button onClick={generate} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Generate UUIDs</button>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-2">
            {uuids.map((u, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-sm rounded">
                {u}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
