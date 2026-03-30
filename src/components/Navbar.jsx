import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Settings2,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { useApp } from '../context/AppContext';
import { filterContentForProfile } from '../utils/contentExperience';
import { getPosterArtwork } from '../utils/streamArtwork';
import ProfileSwitcherModal from './ProfileSwitcherModal';
import SettingsPanel from './SettingsPanel';

function SearchDropdown({
  query,
  results,
  loading,
  recentSearches,
  onSelectResult,
  onSelectRecent,
  onClearRecent,
  isLight,
}) {
  if (!query && recentSearches.length === 0) return null;

  return (
    <div
      className={`absolute right-0 top-full mt-3 w-[min(92vw,420px)] overflow-hidden rounded-[28px] border backdrop-blur-2xl shadow-[0_30px_90px_-48px_rgba(15,23,42,0.96)] ${
        isLight
          ? 'border-slate-200/80 bg-white/92'
          : 'border-white/10 bg-slate-950/92'
      }`}
    >
      {!query ? (
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                Recent Searches
              </p>
              <p className={`mt-1 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Jump back into titles you searched for most recently.
              </p>
            </div>

            <button
              type="button"
              onClick={onClearRecent}
              className={`text-xs font-semibold transition-colors ${
                isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSelectRecent(term)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out ${
                  isLight
                    ? 'border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900'
                    : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`stream-skeleton h-20 rounded-[22px] ${isLight ? 'opacity-60' : ''}`}
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className={`text-base font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>No results</p>
              <p className={`mt-2 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Try another title or genre.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectResult(item)}
                className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
                  isLight ? 'hover:bg-slate-100/90' : 'hover:bg-white/[0.05]'
                }`}
              >
                <img
                  src={getPosterArtwork(item)}
                  alt={item.title}
                  className="h-16 w-12 rounded-2xl border border-white/10 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`truncate text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {item.title}
                    </p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                      item.type === 'series'
                        ? 'border-fuchsia-300/25 bg-fuchsia-300/14 text-fuchsia-200'
                        : 'border-sky-300/25 bg-sky-300/14 text-sky-200'
                    }`}>
                      {item.type === 'series' ? 'Series' : 'Movie'}
                    </span>
                  </div>
                  <p className={`mt-1 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {(item.release_date || '').slice(0, 4) || item.releaseYear || 'New'} | {item.genres?.[0]?.name || item.genre || 'Featured'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    logout,
    isAdmin,
    activeProfile,
    isKidsMode,
    profiles,
    switchProfile,
    addProfile,
    settings,
    updateSettings,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useApp();
  const { query, results, loading, search } = useSearch();

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const isLight = settings.theme === 'light';
  const visibleResults = useMemo(
    () => filterContentForProfile(results, activeProfile).slice(0, 8),
    [activeProfile, results],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleSelect = (item) => {
    const path = item.type === 'series' ? `/series/${item.id}` : `/movie/${item.id}`;
    addRecentSearch(item.title);
    setSearchOpen(false);
    search('');
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/profile', label: 'My List' },
  ];

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? isLight
              ? 'bg-white/88 backdrop-blur-xl shadow-[0_16px_60px_-38px_rgba(15,23,42,0.35)]'
              : 'bg-slate-950/74 backdrop-blur-xl shadow-[0_24px_80px_-48px_rgba(2,6,23,0.95)]'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-4 lg:gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-[0_18px_34px_-18px_rgba(59,130,246,0.95)]">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <p className={`admin-display text-2xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  StreamVault
                </p>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                  {isKidsMode ? 'Kids Space' : 'Premium Streaming'}
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out ${
                    location.pathname === to
                      ? isLight
                        ? 'bg-slate-900 text-white'
                        : 'bg-white/12 text-white'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      : 'text-slate-400 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              ))}

              {isKidsMode && (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/16 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-50">
                  <Sparkles className="h-3.5 w-3.5" />
                  Kids Mode
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out lg:inline-flex ${
                  isLight
                    ? 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900'
                    : 'border-sky-300/20 bg-sky-300/12 text-sky-100 hover:border-sky-300/30 hover:bg-sky-300/18'
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}

            <div ref={searchRef} className="relative">
              <div
                className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ease-in-out ${
                  searchOpen ? 'w-[min(72vw,380px)] sm:w-[320px] lg:w-[380px]' : 'w-11'
                } ${
                  isLight
                    ? 'border-slate-200 bg-white/90'
                    : 'border-white/10 bg-white/[0.05] backdrop-blur-xl'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className={`grid h-11 w-11 place-items-center transition-colors ${
                    isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                  aria-label="Search content"
                >
                  <SearchIcon className="h-[18px] w-[18px]" />
                </button>

                {searchOpen && (
                  <>
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(event) => search(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && visibleResults[0]) {
                          handleSelect(visibleResults[0]);
                        }
                      }}
                      placeholder={isKidsMode ? 'Search kids titles...' : 'Search movies, series, and genres...'}
                      className={`min-w-0 flex-1 bg-transparent pr-2 text-sm outline-none ${
                        isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        search('');
                        setSearchOpen(false);
                      }}
                      className={`mr-2 grid h-8 w-8 place-items-center rounded-full transition-colors ${
                        isLight ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-white/8 hover:text-white'
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {searchOpen && (
                <SearchDropdown
                  query={query}
                  results={visibleResults}
                  loading={loading}
                  recentSearches={recentSearches}
                  onSelectResult={handleSelect}
                  onSelectRecent={(term) => search(term)}
                  onClearRecent={clearRecentSearches}
                  isLight={isLight}
                />
              )}
            </div>

            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 ease-in-out ${
                    isLight
                      ? 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                  }`}
                  aria-label="Open settings"
                >
                  <Settings2 className="h-[18px] w-[18px]" />
                </button>

                <button
                  type="button"
                  onClick={() => setProfileSwitcherOpen(true)}
                  className={`flex items-center gap-3 rounded-full border px-2 py-2 pr-3 transition-all duration-300 ease-in-out ${
                    isLight
                      ? 'border-slate-200 bg-white hover:border-slate-300'
                      : 'border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]'
                  }`}
                >
                  <img
                    src={activeProfile?.avatar}
                    alt={activeProfile?.name}
                    className="h-9 w-9 rounded-full border border-white/10 object-cover"
                  />
                  <div className="hidden text-left sm:block">
                    <p className={`text-sm font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {activeProfile?.name}
                    </p>
                    <p className={`text-xs capitalize ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {activeProfile?.type} profile
                    </p>
                  </div>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_34px_-20px_rgba(59,130,246,0.95)] transition-all duration-300 ease-in-out hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <ProfileSwitcherModal
        open={profileSwitcherOpen}
        profiles={profiles}
        activeProfileId={activeProfile?.id}
        onClose={() => setProfileSwitcherOpen(false)}
        onSwitchProfile={switchProfile}
        onAddProfile={addProfile}
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onOpenAdmin={() => navigate('/admin')}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        settings={settings}
        onUpdateSettings={updateSettings}
        onOpenProfileSwitcher={() => setProfileSwitcherOpen(true)}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onOpenAdmin={() => navigate('/admin')}
      />
    </>
  );
}
