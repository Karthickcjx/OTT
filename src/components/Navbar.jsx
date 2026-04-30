import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
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
import { cx } from '../admin/utils/cx';
import PlaynixLogo from './PlaynixLogo';
import ProfileSwitcherModal from './ProfileSwitcherModal';
import SettingsPanel from './SettingsPanel';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/series', label: 'Series' },
  { to: '/profile#my-list', label: 'My List' },
  { to: '/profile#profile', label: 'Profile' },
];

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
      className={cx(
        'absolute right-0 top-full mt-3 w-[min(92vw,440px)] overflow-hidden rounded-xl border backdrop-blur-2xl shadow-[0_30px_90px_-48px_rgba(0,0,0,0.96)]',
        isLight ? 'border-slate-200/80 bg-white/95' : 'border-white/10 bg-[#0b0b0f]/95',
      )}
    >
      {!query ? (
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-slate-500">
                Recent Searches
              </p>
              <p className={cx('mt-1 text-sm', isLight ? 'text-slate-500' : 'text-slate-400')}>
                Jump back into your latest Playnix searches.
              </p>
            </div>

            <button
              type="button"
              onClick={onClearRecent}
              className={cx(
                'text-xs font-semibold transition-colors',
                isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white',
              )}
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
                className={cx(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5',
                  isLight
                    ? 'border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900'
                    : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-fuchsia-300/30 hover:bg-white/[0.08] hover:text-white',
                )}
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
                <div key={index} className="stream-skeleton h-20 rounded-lg" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className={cx('text-base font-semibold', isLight ? 'text-slate-900' : 'text-white')}>No results</p>
              <p className={cx('mt-2 text-sm', isLight ? 'text-slate-500' : 'text-slate-400')}>
                Try another title or genre.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectResult(item)}
                className={cx(
                  'flex w-full items-center gap-4 px-4 py-3 text-left transition-colors',
                  isLight ? 'hover:bg-slate-100/90' : 'hover:bg-white/[0.05]',
                )}
              >
                <img
                  src={getPosterArtwork(item)}
                  alt={item.title}
                  className="h-16 w-12 rounded-lg border border-white/10 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cx('truncate text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                      {item.title}
                    </p>
                    <span
                      className={cx(
                        'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]',
                        item.type === 'series'
                          ? 'border-fuchsia-300/25 bg-fuchsia-300/14 text-fuchsia-100'
                          : 'border-orange-300/25 bg-orange-300/14 text-orange-100',
                      )}
                    >
                      {item.type === 'series' ? 'Series' : 'Movie'}
                    </span>
                  </div>
                  <p className={cx('mt-1 text-xs', isLight ? 'text-slate-500' : 'text-slate-400')}>
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const isLight = settings.theme === 'light' && !isKidsMode;
  const visibleResults = useMemo(
    () => filterContentForProfile(results, activeProfile).slice(0, 8),
    [activeProfile, results],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    onScroll();
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
    if (searchOpen) inputRef.current?.focus();
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

  const isActiveLink = (to) => {
    const [path, hash] = to.split('#');
    if (path === '/' && location.pathname === '/') return true;
    if (path !== location.pathname) return false;
    if (!hash) return true;
    if (hash === 'profile' && !location.hash) return true;
    return location.hash === `#${hash}`;
  };

  const renderNavLink = ({ to, label }, mobile = false) => (
    <Link
      key={to}
      to={to}
      onClick={() => {
        if (mobile) setMobileOpen(false);
      }}
      className={cx(
        'relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out',
        mobile && 'w-full rounded-lg px-3 py-3',
        isActiveLink(to)
          ? 'bg-white text-[#0b0b0f] shadow-[0_0_28px_-16px_rgba(236,72,153,0.95)]'
          : isLight
          ? 'text-slate-600 hover:bg-slate-200 hover:text-slate-950'
          : 'text-slate-300 hover:bg-white/[0.08] hover:text-white',
      )}
    >
      {label}
      {isActiveLink(to) && (
        <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full playnix-gradient-bg" />
      )}
    </Link>
  );

  return (
    <>
      <nav
        className={cx(
          'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? isLight
              ? 'border-slate-200/80 bg-white/88 backdrop-blur-xl shadow-[0_16px_60px_-38px_rgba(15,23,42,0.35)]'
              : 'border-white/10 bg-[#0b0b0f]/82 backdrop-blur-xl shadow-[0_24px_80px_-52px_rgba(0,0,0,0.98)]'
            : 'border-white/5 bg-[#0b0b0f]/48 backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-4 lg:gap-8">
            <Link to="/" className="flex min-w-0 items-center" aria-label="Playnix home">
              <PlaynixLogo size="md" className="max-sm:[&>span:last-child]:hidden" />
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => renderNavLink(link))}

              {isKidsMode && (
                <span className="ml-2 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-50">
                  <Sparkles className="h-3.5 w-3.5" />
                  Kids
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="hidden items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-300/12 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-fuchsia-300/35 hover:bg-fuchsia-300/18 lg:inline-flex"
              >
                <Shield className="h-4 w-4" />
                Admin
              </button>
            )}

            <div ref={searchRef} className="relative">
              <div
                className={cx(
                  'flex items-center overflow-hidden rounded-full border transition-all duration-300 ease-in-out',
                  searchOpen ? 'w-[min(72vw,380px)] sm:w-[320px] lg:w-[380px]' : 'w-11',
                  isLight
                    ? 'border-slate-200 bg-white/92'
                    : 'border-white/10 bg-white/[0.05] backdrop-blur-xl',
                )}
              >
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className={cx(
                    'grid h-11 w-11 place-items-center transition-colors',
                    isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-300 hover:text-white',
                  )}
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
                      className={cx(
                        'min-w-0 flex-1 bg-transparent pr-2 text-sm outline-none',
                        isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500',
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        search('');
                        setSearchOpen(false);
                      }}
                      className={cx(
                        'mr-2 grid h-8 w-8 place-items-center rounded-full transition-colors',
                        isLight ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-white/8 hover:text-white',
                      )}
                      aria-label="Close search"
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
                  className={cx(
                    'grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 ease-in-out hover:-translate-y-0.5',
                    isLight
                      ? 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-fuchsia-300/25 hover:bg-white/[0.08] hover:text-white',
                  )}
                  aria-label="Open settings"
                >
                  <Settings2 className="h-[18px] w-[18px]" />
                </button>

                <button
                  type="button"
                  onClick={() => setProfileSwitcherOpen(true)}
                  className={cx(
                    'flex items-center gap-3 rounded-full border px-2 py-2 pr-3 transition-all duration-300 ease-in-out hover:-translate-y-0.5',
                    isLight
                      ? 'border-slate-200 bg-white hover:border-slate-300'
                      : 'border-white/10 bg-white/[0.05] hover:border-fuchsia-300/25 hover:bg-white/[0.08]',
                  )}
                >
                  <img
                    src={activeProfile?.avatar}
                    alt={activeProfile?.name}
                    className="h-9 w-9 rounded-full border border-white/10 object-cover"
                  />
                  <div className="hidden text-left sm:block">
                    <p className={cx('text-sm font-semibold leading-tight', isLight ? 'text-slate-900' : 'text-white')}>
                      {activeProfile?.name}
                    </p>
                    <p className={cx('text-xs capitalize', isLight ? 'text-slate-500' : 'text-slate-400')}>
                      {activeProfile?.type} profile
                    </p>
                  </div>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="playnix-button-primary rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className={cx(
                'grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 ease-in-out md:hidden',
                isLight ? 'border-slate-200 bg-white text-slate-700' : 'border-white/10 bg-white/[0.05] text-white',
              )}
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 px-4 pb-4 md:hidden">
            <div className="mx-auto grid max-w-[1600px] gap-2 pt-3">
              {NAV_LINKS.map((link) => renderNavLink(link, true))}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="mt-1 inline-flex items-center gap-2 rounded-lg border border-fuchsia-300/20 bg-fuchsia-300/12 px-3 py-3 text-sm font-semibold text-fuchsia-100"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </button>
              )}
            </div>
          </div>
        )}
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
