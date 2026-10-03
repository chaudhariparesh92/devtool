import { Link, useSearchParams } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import { routes } from '../App';

// Helper function to dynamically map a route path to a category
const getCategoryForPath = (path) => {
  if (path.includes('json')) return 'JSON Tools';
  if (path.includes('encode') || path.includes('decode')) return 'Encoders & Decoders';
  if (path.includes('generator') || path.includes('hash') || path.includes('uuid')) return 'Generators & Hashes';
  if (path.includes('time') || path.includes('cron') || path.includes('query') || path.includes('color') || path.includes('hex-to') || path.includes('rgb')) return 'Web Tools';
  return 'Text & Data'; // Fallback for diff, text, case, xml, yaml, csv, regex, etc.
};

export default function ToolsIndex() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  // Filter out static pages and root pages
  let displayRoutes = routes.filter(r => 
    r.path.startsWith('/') && 
    r.path.length > 2 && 
    !['/about','/contact','/privacy','/terms','/categories','/tools'].includes(r.path)
  );

  // Apply category filter if it exists in the URL
  if (categoryFilter) {
    displayRoutes = displayRoutes.filter(r => getCategoryForPath(r.path) === categoryFilter);
  }

  return (
    <div className="space-y-8">
      <SeoHead 
        title={categoryFilter ? `${categoryFilter} - Developer Tools` : "All Developer Tools"} 
        description="Complete list of all developer tools." 
        url="/tools" 
      />
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
         <div>
           <h1 className="text-3xl font-bold">{categoryFilter ? categoryFilter : "All Developer Tools"}</h1>
           <p className="text-gray-600 dark:text-gray-400 mt-2">
             {categoryFilter ? `Showing tools for ${categoryFilter}.` : "Select a tool to get started."}
           </p>
         </div>
         {categoryFilter && (
           <Link to="/tools" className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
             Clear Filter
           </Link>
         )}
      </div>
      
      {displayRoutes.length === 0 ? (
         <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            No tools found for this category.
         </div>
      ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
           {displayRoutes.map(r => (
             <Link key={r.path} to={r.path} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-sm truncate transition-all">
               {r.path.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
             </Link>
           ))}
         </div>
      )}
    </div>
  );
}