import { createElement } from 'react';
import { Check, Clapperboard, Play, Plus, Sparkles, Star, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getBackdropArtwork } from '../utils/streamArtwork';
import {
  getGenreNames,
  getReleaseYear,
  getRuntimeLabel,
} from '../utils/contentExperience';
import { cx } from '../admin/utils/cx';

function HeroButton({ icon: Icon, children, primary = false, onClick, tone = 'default', light = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5',
        primary
          ? 'bg-white text-slate-950 shadow-[0_22px_44px_-28px_rgba(255,255,255,0.95)] hover:bg-slate-100'
          : tone === 'kids'
          ? 'border border-amber-300/25 bg-amber-300/12 text-amber-50 hover:bg-amber-300/20'
          : light
          ? 'border border-slate-300 bg-white/78 text-slate-800 hover:border-slate-400 hover:bg-white'
          : 'border border-white/14 bg-white/[0.06] text-white hover:border-white/24 hover:bg-white/[0.1]',
      )}
    >
      {createElement(Icon, { className: 'h-4 w-4' })}
      {children}
    </button>
  );
}

export default function Banner({ movie, activeProfile, isKidsMode, onPreview }) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, settings, isAuthenticated } = useApp();

  if (!movie) return null;

  const isSeries = movie.type === 'series';
  const inWatchlist = isInWatchlist(movie.id);
  const backdropUrl = getBackdropArtwork(movie, isKidsMode);
  const year = getReleaseYear(movie);
  const runtimeLabel = getRuntimeLabel(movie);
  const isLight = settings.theme === 'light' && !isKidsMode;

  const watchPath = isSeries
    ? `/watch/${movie.id}?type=series&season=1&episode=1`
    : `/watch/${movie.id}`;

  const detailPath = isSeries ? `/series/${movie.id}` : `/movie/${movie.id}`;

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      return;
    }

    addToWatchlist(movie);
  };

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <img
        src={backdropUrl}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div
        className={cx(
          'absolute inset-0',
          isLight
            ? 'bg-[linear-gradient(90deg,rgba(248,250,252,0.92)_0%,rgba(248,250,252,0.74)_30%,rgba(248,250,252,0.14)_58%,rgba(15,23,42,0.35)_100%)]'
            : isKidsMode
            ? 'bg-[linear-gradient(90deg,rgba(8,19,39,0.96)_0%,rgba(8,19,39,0.76)_32%,rgba(8,19,39,0.22)_64%,rgba(8,19,39,0.58)_100%)]'
            : 'bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_30%,rgba(2,6,23,0.22)_62%,rgba(2,6,23,0.68)_100%)]',
        )}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.18)_38%,rgba(2,6,23,0.88)_100%)]" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-[1600px] items-end px-4 pb-24 pt-28 sm:px-6 lg:px-10">
        <div className="w-full max-w-4xl animate-[stream-fade-up_0.75s_ease-out]">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cx(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]',
                isKidsMode
                  ? 'border-amber-300/25 bg-amber-300/14 text-amber-50'
                  : isLight
                  ? 'border-slate-300 bg-white/70 text-slate-700'
                  : 'border-white/14 bg-white/[0.06] text-slate-200',
              )}
            >
              {isKidsMode ? <Sparkles className="h-3.5 w-3.5" /> : <Clapperboard className="h-3.5 w-3.5" />}
              {isSeries ? 'Series Premiere' : 'Featured Tonight'}
            </span>

            {activeProfile && isAuthenticated && (
              <span
                className={cx(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]',
                  isLight
                    ? 'border-slate-300 bg-white/70 text-slate-700'
                    : 'border-white/12 bg-black/20 text-slate-200',
                )}
              >
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
                {activeProfile.name}
              </span>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {getGenreNames(movie).slice(0, 3).map((genre) => (
              <span
                key={genre}
                className={cx(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]',
                  isLight
                    ? 'border-slate-300/80 bg-white/65 text-slate-600'
                    : 'border-white/12 bg-black/20 text-slate-300',
                )}
              >
                {genre}
              </span>
            ))}
          </div>

          <h1
            className={cx(
              'admin-display mt-6 max-w-4xl font-semibold leading-[0.9]',
              isKidsMode ? 'text-5xl sm:text-6xl lg:text-7xl' : 'text-5xl sm:text-6xl lg:text-7xl',
              isLight ? 'text-slate-950' : 'text-white',
            )}
          >
            {movie.title}
          </h1>

          <div
            className={cx(
              'mt-6 flex flex-wrap items-center gap-3 text-sm',
              isLight ? 'text-slate-600' : 'text-slate-300',
            )}
          >
            {movie.vote_average && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/12 px-4 py-2 font-semibold text-amber-50">
                <Star className="h-4 w-4 fill-current" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}

            <span className={cx(
              'rounded-full border px-4 py-2 font-medium',
              isLight ? 'border-slate-300 bg-white/70 text-slate-700' : 'border-white/12 bg-black/20 text-slate-200',
            )}>
              {year}
            </span>

            {runtimeLabel && (
              <span className={cx(
                'rounded-full border px-4 py-2 font-medium',
                isLight ? 'border-slate-300 bg-white/70 text-slate-700' : 'border-white/12 bg-black/20 text-slate-200',
              )}>
                {runtimeLabel}
              </span>
            )}

            <span className={cx(
              'rounded-full border px-4 py-2 font-medium',
              isLight ? 'border-slate-300 bg-white/70 text-slate-700' : 'border-white/12 bg-black/20 text-slate-200',
            )}>
              {isSeries ? 'Binge ready' : 'Movie night'}
            </span>
          </div>

          <p
            className={cx(
              'mt-6 max-w-2xl text-base leading-8 sm:text-lg',
              isLight ? 'text-slate-700' : 'text-slate-300',
            )}
          >
            {movie.overview}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <HeroButton primary icon={Play} onClick={() => navigate(watchPath)}>
              Play
            </HeroButton>

            <HeroButton
              icon={inWatchlist ? Check : Plus}
              onClick={toggleWatchlist}
              tone={isKidsMode ? 'kids' : 'default'}
              light={isLight}
            >
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </HeroButton>

            <HeroButton
              icon={Tv}
              onClick={() => {
                if (onPreview) {
                  onPreview(movie);
                  return;
                }

                navigate(detailPath);
              }}
              tone={isKidsMode ? 'kids' : 'default'}
              light={isLight}
            >
              Trailer
            </HeroButton>
          </div>
        </div>
      </div>
    </section>
  );
}
