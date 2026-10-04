import SeoHead from './SeoHead';
export default function ToolLayout({ title, desc, path, children }) {
  return (
    <div className="space-y-6">
      <SeoHead title={`${title} - Free Developer Tool`} description={desc} url={path} />
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{desc}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[400px]">
        {children}
      </div>
    </div>
  );
}