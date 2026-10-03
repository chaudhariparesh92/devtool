import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  return (
    <ToolLayout 
      title="JSON Formatter" 
      description="Format and beautify JSON online with this free JSON formatter." 
      url="/json-formatter"
      intro="Format, beautify, and validate JSON online securely in your browser."
    >
      <div className="p-6 space-y-4">
        <textarea 
          className="w-full h-48 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-4">
          <button onClick={formatJson} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Format JSON</button>
          <button onClick={minifyJson} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Minify</button>
          <button onClick={() => {setInput(''); setOutput(''); setError(null);}} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Clear</button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded">
            Invalid JSON: {error}
          </div>
        )}

        {output && (
          <div className="relative">
            <textarea 
              readOnly
              className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded"
              value={output}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
