import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

export default function NotFound() {
  return (
    <div className="text-center py-16 space-y-5">
      <SeoHead title="404 - Tool Not Found | FREE Developer Tool" description="That page does not exist. Browse all free developer tools instead." />
      <p className="font-code text-sm" style={{ color: 'var(--muted)' }}>$ cd /this-page<br />bash: no such file or directory</p>
      <h1 className="h-display text-5xl sm:text-6xl">404 - Tool Not Found</h1>
      <p className="lede mx-auto">The tool you are looking for does not exist (yet). It happens to the best of us.</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link to="/tools" className="btn btn-primary">Explore Free Developer Tools</Link>
        <Link to="/" className="btn btn-ghost">Back home</Link>
      </div>
    </div>
  );
}
