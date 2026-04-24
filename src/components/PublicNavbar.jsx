import { Link, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl select-none">✍️</span>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            WriteSpace
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              isActive('/login')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              isActive('/register')
                ? 'bg-violet-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}