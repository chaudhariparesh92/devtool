export default function DownloadButton({ text, filename = 'output.txt', label = 'Download', className = '' }) {
  const handleDownload = () => {
    if (!text) return;
    const type = /\.json$/i.test(filename) ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8';
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!text}
      className={`px-3 py-1.5 rounded text-xs font-medium shadow-sm transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {label}
    </button>
  );
}
