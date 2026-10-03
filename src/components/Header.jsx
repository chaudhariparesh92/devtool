import { Link } from 'react-router-dom';
import { Terminal, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggleDark = () => { document.documentElement.classList.toggle('dark'); setDark(!dark); };
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-[1400px]">
        <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
          <Terminal size={24} /><span>DevTools Pro</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link to="/tools" className="hover:text-indigo-500">All Tools</Link>
          <Link to="/categories" className="hover:text-indigo-500">Categories</Link>
        </nav>
        <button onClick={toggleDark} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}