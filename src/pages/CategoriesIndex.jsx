import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

const CATEGORIES = [
  'JSON Tools', 
  'Encoders & Decoders', 
  'Generators & Hashes', 
  'Network & Monitoring',
  'Web Tools', 
  'Text & Data'
];

export default function CategoriesIndex() {
  return (
    <div className="space-y-8">
      <SeoHead title="Tool Categories" description="Browse tools by category." url="/categories" />
      <h1 className="text-3xl font-bold">Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(c => (
           <div key={c} className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
             <h2 className="text-xl font-bold mb-4">{c}</h2>
             <Link 
               to={`/tools?category=${encodeURIComponent(c)}`} 
               className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
             >
               View {c} &rarr;
             </Link>
           </div>
        ))}
      </div>
    </div>
  );
}