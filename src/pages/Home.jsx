import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import AdSlot from '../components/AdSlot';

export default function Home() {
  // A selection of popular tools to feature on the homepage
  const popularTools = [
    { name: 'JSON Formatter', path: '/json-formatter' }, 
    { name: 'JWT Decoder', path: '/jwt-decoder' },
    { name: 'UUID Generator', path: '/uuid-generator' }, 
    { name: 'Base64 Decoder', path: '/base64-decoder' },
    { name: 'JSON to C#', path: '/json-to-csharp' }, 
    { name: 'Timestamp Converter', path: '/timestamp-converter' }
  ];

  return (
    <div className="space-y-12 text-center">
      <SeoHead 
        title="Free DevTools" 
        description="Fast, private tools for developers. Process JSON, decode JWTs, generate UUIDs, and more." 
        url="/" 
      />
      
      {/* Hero Section */}
      <div className="py-12">
        <h1 className="text-5xl font-bold mb-4">Free DevToolss</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Fast, private, browser-based tools. No signup.
        </p>
      </div>

      {/* In-Feed Homepage Ad */}
      <div className="flex justify-center w-full">
         <AdSlot className="w-full max-w-[728px] h-[90px]" slot="YOUR_HOME_IN_FEED_AD_SLOT" />
      </div>

      {/* Popular Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto mt-12">
        {popularTools.map(tool => (
          <Link 
            key={tool.path} 
            to={tool.path} 
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm transition-colors block"
          >
            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {tool.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Free {tool.name} utility.
            </p>
          </Link>
        ))}
      </div>
      
      {/* View All Button */}
      <div className="pt-8 pb-12">
        <Link to="/tools" className="inline-block px-8 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-bold transition-colors">
          View All 50+ Tools &rarr;
        </Link>
      </div>
    </div>
  );
}