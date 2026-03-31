import { Clapperboard, Globe2, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { cx } from '../admin/utils/cx';

export default function Footer() {
  const { user, activeProfile, isAdmin, isKidsMode, settings } = useApp();
  const isLight = settings.theme === 'light' && !isKidsMode;
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-10 pt-16 sm:px-6 lg:px-10">
      <div
        className={cx(
          'mx-auto max-w-[1600px] overflow-hidden rounded-[36px] border p-6 sm:p-8',
          isLight
            ? 'border-slate-200 bg-white/76 shadow-[0_24px_60px_-40px_rgba(37,99,235,0.2)]'
            : 'border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_30px_90px_-56px_rgba(15,23,42,0.96)]',
        )}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-[0_20px_42px_-20px_rgba(59,130,246,0.95)]">
                <Clapperboard className="h-6 w-6" />
              </div>
              <div>
                <h2 className={cx('admin-display text-2xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  StreamVault
                </h2>
                <p className={cx('mt-1 text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                  Premium streaming discovery with profile-aware browsing, cinematic hero content, and polished content rails.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className={cx('rounded-[24px] border px-4 py-3', isLight ? 'border-slate-200 bg-white/70' : 'border-white/10 bg-white/[0.04]')}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Active profile
                </p>
                <p className={cx('mt-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  {activeProfile?.name || 'Guest'}
                </p>
              </div>

              <div className={cx('rounded-[24px] border px-4 py-3', isLight ? 'border-slate-200 bg-white/70' : 'border-white/10 bg-white/[0.04]')}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Interface
                </p>
                <p className={cx('mt-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  {isKidsMode ? 'Kids mode' : settings.theme === 'light' ? 'Light theme' : 'Dark theme'}
                </p>
              </div>

              <div className={cx('rounded-[24px] border px-4 py-3', isLight ? 'border-slate-200 bg-white/70' : 'border-white/10 bg-white/[0.04]')}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Language
                </p>
                <p className={cx('mt-2 inline-flex items-center gap-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                  <Globe2 className="h-4 w-4 text-sky-400" />
                  {settings.language}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                Explore
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/profile', label: 'My List' },
                  { to: '/login', label: user ? 'Account' : 'Log In' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={cx(
                      'block rounded-[20px] border px-4 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5',
                      isLight
                        ? 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                        : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                Status
              </p>
              <div className="mt-4 space-y-3">
                <div className={cx('rounded-[20px] border px-4 py-3', isLight ? 'border-slate-200 bg-white/70' : 'border-white/10 bg-white/[0.04]')}>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <Sparkles className="h-4 w-4" />
                    Experience updated
                  </p>
                  <p className={cx('mt-2 text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                    Hero, search, profiles, and premium content rows are all active.
                  </p>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block rounded-[20px] border border-sky-300/20 bg-sky-300/12 px-4 py-3 text-sm font-semibold text-sky-100 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-sky-300/18"
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
          <p>{year} StreamVault. All rights reserved.</p>
          <p>Artwork mode: {isKidsMode ? 'family-safe' : 'cinematic'}</p>
        </div>
      </div>
    </footer>
  );
}
