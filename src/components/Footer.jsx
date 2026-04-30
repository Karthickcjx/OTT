import { Globe2, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { cx } from '../admin/utils/cx';
import PlaynixLogo from './PlaynixLogo';

export default function Footer() {
  const { user, activeProfile, isAdmin, isKidsMode, settings } = useApp();
  const isLight = settings.theme === 'light' && !isKidsMode;
  const year = new Date().getFullYear();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/series', label: 'Series' },
    { to: '/profile#my-list', label: 'My List' },
    { to: '/profile#profile', label: user ? 'Profile' : 'Log In' },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#08080c]/72 px-4 py-10 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <PlaynixLogo size="md" tagline />
            <p className={cx('mt-5 max-w-2xl text-sm leading-7', isLight ? 'text-slate-600' : 'text-slate-400')}>
              A modern premium streaming experience with cinematic discovery, profile-aware recommendations,
              smooth content rails, and playback controls tuned for long sessions.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className={cx('rounded-xl border px-4 py-3', isLight ? 'border-slate-200 bg-white/70' : 'border-white/10 bg-white/[0.04]')}>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Active profile
                </p>
                <p className={cx('mt-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  {activeProfile?.name || 'Guest'}
                </p>
              </div>

              <div className={cx('rounded-xl border px-4 py-3', isLight ? 'border-slate-200 bg-white/70' : 'border-white/10 bg-white/[0.04]')}>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Interface
                </p>
                <p className={cx('mt-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  {isKidsMode ? 'Kids mode' : settings.theme === 'light' ? 'Light theme' : 'Dark theme'}
                </p>
              </div>

              <div className={cx('rounded-xl border px-4 py-3', isLight ? 'border-slate-200 bg-white/70' : 'border-white/10 bg-white/[0.04]')}>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Language
                </p>
                <p className={cx('mt-2 inline-flex items-center gap-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  <Globe2 className="h-4 w-4 text-fuchsia-300" />
                  {settings.language}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Explore
              </p>
              <div className="mt-4 grid gap-2">
                {links.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={cx(
                      'rounded-lg border px-4 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5',
                      isLight
                        ? 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                        : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-fuchsia-300/25 hover:bg-white/[0.08] hover:text-white',
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Status
              </p>
              <div className="mt-4 space-y-3">
                <div className={cx('rounded-xl border px-4 py-3', isLight ? 'border-slate-200 bg-white/70' : 'border-white/10 bg-white/[0.04]')}>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-200">
                    <Sparkles className="h-4 w-4" />
                    Playnix experience active
                  </p>
                  <p className={cx('mt-2 text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                    Hero, rows, search, profiles, and watchlist controls are ready.
                  </p>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block rounded-lg border border-fuchsia-300/20 bg-fuchsia-300/12 px-4 py-3 text-sm font-semibold text-fuchsia-100 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-fuchsia-300/35 hover:bg-fuchsia-300/18"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Open admin panel
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={cx('mt-8 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between', isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-500')}>
          <p>{year} Playnix. All rights reserved.</p>
          <p>Artwork mode: {isKidsMode ? 'family-safe' : 'cinematic'}</p>
        </div>
      </div>
    </footer>
  );
}
