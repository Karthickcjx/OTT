import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useApp } from '../context/AppContext';

function SearchResults({ results, onSelect }) {
  if (!results.length) return null;
  return (
    <div className="absolute top-full mt-2 left-0 right-0 bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-80 overflow-y-auto">
      {results.map((movie) => (
        <button
          key={movie.id}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
          onClick={() => onSelect(movie)}
        >
          <div className="w-8 h-8 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
            {movie.title?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{movie.title}</p>
            <p className="text-gray-500 text-xs">{movie.release_date?.slice(0, 4)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useApp();
  const { query, results, search } = useSearch();

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (movie) => {
    setSearchOpen(false);
    search('');
    navigate(`/movie/${movie.id}`);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/profile', label: 'My List' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">StreamVault</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div ref={searchRef} className="relative">
            {searchOpen ? (
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => search(e.target.value)}
                  placeholder="Search movies..."
                  className="w-48 md:w-64 bg-black/80 border border-white/20 text-white placeholder-gray-500 text-sm px-4 py-2 pr-8 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  onClick={() => { setSearchOpen(false); search(''); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <SearchResults results={results} onSelect={handleSelect} />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            )}
          </div>

          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold transition-colors"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 text-sm transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/10 text-sm transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-white/5 text-sm transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
