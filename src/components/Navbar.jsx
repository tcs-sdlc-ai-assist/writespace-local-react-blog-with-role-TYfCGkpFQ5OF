import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/storage.js';
import { logout } from '../utils/auth.js';
import Avatar from './Avatar.jsx';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();

  const isActive = (path) => location.pathname === path;

  const isAdminUser = session && session.role === 'admin';

  const navLinks = [
    { to: '/blogs', label: 'All Blogs' },
    { to: '/write', label: 'Write' },
  ];

  if (isAdminUser) {
    navLinks.push({ to: '/users', label: 'Users' });
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login', { replace: true });
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm relative">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/blogs" className="flex items-center gap-2" onClick={closeMobile}>
          <span className="text-2xl select-none">✍️</span>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            WriteSpace
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop avatar chip + dropdown */}
        <div className="hidden md:flex items-center gap-3 relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Avatar role={session?.role || 'user'} size="sm" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-slate-800 leading-tight">
                {session?.displayName || 'User'}
              </span>
              <span
                className={`text-xs font-medium leading-tight ${
                  isAdminUser ? 'text-violet-600' : 'text-indigo-600'
                }`}
              >
                {session?.role || 'user'}
              </span>
            </div>
            <span className="text-slate-400 text-xs select-none ml-1">▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-md py-1 z-50 min-w-[140px]">
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-medium text-pink-600 hover:bg-pink-50 px-4 py-2 transition-colors cursor-pointer"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={toggleMobile}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className="text-xl select-none">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobile}
              className={`block text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-slate-200 mt-2 pt-2">
            <div className="flex items-center gap-2 px-4 py-2">
              <Avatar role={session?.role || 'user'} size="sm" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800 leading-tight">
                  {session?.displayName || 'User'}
                </span>
                <span
                  className={`text-xs font-medium leading-tight ${
                    isAdminUser ? 'text-violet-600' : 'text-indigo-600'
                  }`}
                >
                  {session?.role || 'user'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm font-medium text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </nav>
  );
}