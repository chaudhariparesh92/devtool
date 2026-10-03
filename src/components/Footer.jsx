export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-8 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>&copy; 2026 DevTools Pro. All logic runs locally in your browser.</p>
        <div className="mt-4 flex justify-center gap-4">
          <a href="/about" className="hover:text-indigo-500">About</a>
          <a href="/privacy" className="hover:text-indigo-500">Privacy</a>
          <a href="/terms" className="hover:text-indigo-500">Terms</a>
          <a href="/contact" className="hover:text-indigo-500">Contact</a>
        </div>
      </div>
    </footer>
  );
}