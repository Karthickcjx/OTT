import { createElement, useMemo, useState } from 'react';
import { Heart, History, LogOut, Shield, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  filterContentForProfile,
  getReleaseYear,
} from '../utils/contentExperience';
import { getPosterArtwork } from '../utils/streamArtwork';
import { cx } from '../admin/utils/cx';

function MediaTile({ item, showRemove, onRemove }) {
  const navigate = useNavigate();
  const isSeries = item.type === 'series';
  const detailPath = isSeries ? `/series/${item.id}` : `/movie/${item.id}`;

  return (
    <article
      className="group cursor-pointer"
      onClick={() => navigate(detailPath)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:border-fuchsia-300/25 group-hover:shadow-[0_28px_70px_-40px_rgba(236,72,153,0.62)]">
        <img
          src={getPosterArtwork(item)}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.16)_38%,rgba(2,6,23,0.9)_100%)]" />

        {showRemove && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(item.id);
            }}
            className="absolute right-3 top-3 rounded-full border border-rose-300/20 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-100 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 hover:bg-rose-400/18"
          >
            Remove
          </button>
        )}

        <div className="absolute inset-x-4 bottom-4">
          <p className="line-clamp-2 text-sm font-semibold text-white">{item.title}</p>
          <p className="mt-1 text-xs text-slate-300">
            {getReleaseYear(item)} | {isSeries ? 'Series' : 'Movie'}
          </p>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ icon: Icon, title, message, linkTo, linkLabel, isLight }) {
  return (
    <div className="stream-card rounded-xl px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
        {createElement(Icon, { className: 'h-7 w-7 text-slate-400' })}
      </div>
      <h2 className={cx('admin-display mt-5 text-3xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>{title}</h2>
      <p className={cx('mx-auto mt-3 max-w-xl text-sm leading-6', isLight ? 'text-slate-600' : 'text-slate-400')}>{message}</p>
      {linkTo && (
        <Link
          to={linkTo}
          className="playnix-button-primary mt-6 inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    logout,
    watchlist,
    recentlyWatched,
    removeFromWatchlist,
    activeProfile,
    isAdmin,
    isKidsMode,
    settings,
  } = useApp();
  const [tab, setTab] = useState('watchlist');

  const filteredWatchlist = useMemo(
    () => filterContentForProfile(watchlist, activeProfile),
    [activeProfile, watchlist],
  );

  const filteredRecent = useMemo(
    () => filterContentForProfile(recentlyWatched, activeProfile),
    [activeProfile, recentlyWatched],
  );
  const isLight = settings.theme === 'light' && !isKidsMode;

  if (!user) {
    return (
      <div className="px-4 pb-16 pt-32 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <EmptyState
            icon={Sparkles}
            title="Sign in to manage your list"
            message="Your watchlist, recent plays, and profile settings live inside your account."
            linkTo="/login"
            linkLabel="Sign In"
            isLight={isLight}
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'watchlist', label: `Watchlist (${filteredWatchlist.length})`, icon: Heart },
    { id: 'recent', label: `Recently Watched (${filteredRecent.length})`, icon: History },
  ];

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <section id="profile" className="stream-card scroll-mt-28 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={activeProfile?.avatar}
                alt={activeProfile?.name}
                className="h-20 w-20 rounded-xl border border-white/10 object-cover"
              />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Viewer Hub
                </p>
                <h1 className={cx('admin-display mt-3 text-3xl font-semibold sm:text-4xl', isLight ? 'text-slate-900' : 'text-white')}>
                  {activeProfile?.name || user.name}
                </h1>
                <p className={cx('mt-2 text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                  {user.email} | {isKidsMode ? 'Kids profile active' : 'Full catalogue access'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-300/12 px-5 py-3 text-sm font-semibold text-fuchsia-100 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-fuchsia-300/30 hover:bg-fuchsia-300/18"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-rose-400/18"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                Theme
              </p>
              <p className={cx('mt-2 text-sm font-semibold capitalize', isLight ? 'text-slate-900' : 'text-white')}>{settings.theme}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                Watchlist
              </p>
              <p className={cx('mt-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>{filteredWatchlist.length} titles</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                Recent activity
              </p>
              <p className={cx('mt-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>{filteredRecent.length} titles</p>
            </div>
          </div>
        </section>

        <div id="my-list" className="inline-flex scroll-mt-28 rounded-full border border-white/10 bg-white/[0.04] p-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = tab === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out',
                  active
                    ? 'bg-white text-slate-950 shadow-[0_16px_30px_-18px_rgba(255,255,255,0.95)]'
                    : isLight
                    ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white',
                )}
              >
                  {createElement(Icon, { className: 'h-4 w-4' })}
                  {label}
                </button>
            );
          })}
        </div>

        {tab === 'watchlist' && (
          filteredWatchlist.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your watchlist is waiting"
              message={isKidsMode
                ? 'Save a few family-safe picks and they will show up here for this profile.'
                : 'Add titles from the homepage or preview modal to build your next movie night.'}
              linkTo="/"
              linkLabel="Browse content"
              isLight={isLight}
            />
          ) : (
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {filteredWatchlist.map((item) => (
                <MediaTile
                  key={item.id}
                  item={item}
                  showRemove
                  onRemove={removeFromWatchlist}
                />
              ))}
            </section>
          )
        )}

        {tab === 'recent' && (
          filteredRecent.length === 0 ? (
            <EmptyState
              icon={History}
              title="No recent plays yet"
              message="Start watching a movie or series and it will appear here for quick access."
              linkTo="/"
              linkLabel="Start watching"
              isLight={isLight}
            />
          ) : (
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {filteredRecent.map((item) => (
                <MediaTile key={item.id} item={item} showRemove={false} />
              ))}
            </section>
          )
        )}
      </div>
    </div>
  );
}
