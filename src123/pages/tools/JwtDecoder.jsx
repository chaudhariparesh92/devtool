import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState(null);

  const decodeJwt = () => {
    try {
      const parts = input.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      setDecoded({ header, payload, signature: parts[2] });
      setError(null);
    } catch (e) {
      setError('Failed to decode JWT. Ensure it is a valid token.');
      setDecoded(null);
    }
  };

  return (
    <ToolLayout 
      title="JWT Decoder" 
      description="Decode JSON Web Tokens (JWT) securely in your browser." 
      url="/jwt-decoder"
      intro="Paste a JWT below to decode its header, payload, and signature."
    >
      <div className="p-6 space-y-4">
        <textarea 
          className="w-full h-32 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Paste JWT here (ey...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex gap-4">
          <button onClick={decodeJwt} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Decode JWT</button>
          <button onClick={() => {setInput(''); setDecoded(null); setError(null);}} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Clear</button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded">
            {error}
          </div>
        )}

        {decoded && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">Header</h3>
              <pre className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded overflow-x-auto text-sm text-red-600 dark:text-red-400">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Payload</h3>
              <pre className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded overflow-x-auto text-sm text-purple-600 dark:text-purple-400">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
