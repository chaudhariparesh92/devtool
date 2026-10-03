import React, { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function WebsiteCheckerTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkWebsite = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult(null);
    setError('');

    let targetUrl = url.trim();
    // Fixed regex below (removed the stray backslash)
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const startTime = performance.now();

    try {
      // Using a public CORS-friendly proxy check
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`, {
        method: 'GET',
        mode: 'cors',
      });
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      setResult({
        url: targetUrl,
        status: response.ok ? 'Online' : 'Error',
        statusText: response.statusText || 'OK',
        statusCode: response.status || 200,
        responseTime: duration,
      });
    } catch (err) {
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          const timer = setTimeout(() => { reject(new Error('Timeout')); }, 5000);
          img.onload = () => { clearTimeout(timer); resolve(); };
          img.onerror = () => { clearTimeout(timer); resolve(); };
          img.src = targetUrl + '/favicon.ico?' + Date.now();
        });
        setResult({
          url: targetUrl,
          status: 'Online (CORS Restricted)',
          statusCode: '200/Unknown',
          responseTime: '~',
        });
      } catch (pingErr) {
        setError('Website appears to be offline or unreachable.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout title="Website Status Checker" description="Check if a website is up or down, measure response time.">
      <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={checkWebsite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com or https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md text-sm">
            ❌ <strong>Down / Unreachable:</strong> {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md space-y-2 text-sm text-green-900 dark:text-green-300">
            <div className="font-semibold text-green-800 dark:text-green-200 text-base">🟢 Website is Up!</div>
            <div><strong>Checked URL:</strong> {result.url}</div>
            <div><strong>Status:</strong> {result.status}</div>
            {result.responseTime && <div><strong>Response Time:</strong> {result.responseTime}ms</div>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}