import { useEffect } from 'react';
import { Check, Play, Plus, Star, Tv, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  getGenreNames,
  getReleaseYear,
  getRuntimeLabel,
} from '../utils/contentExperience';
import { getBackdropArtwork } from '../utils/streamArtwork';
import { cx } from '../admin/utils/cx';

export default function Modal({ movie, onClose }) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, isKidsMode } = useApp();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (!movie) return null;

  const isSeries = movie.type === 'series';
  const inWatchlist = isInWatchlist(movie.id);
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/78 backdrop-blur-xl" />

      <div
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.96))] shadow-[0_50px_120px_-48px_rgba(15,23,42,0.98)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-black/55"
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative h-[300px] overflow-hidden sm:h-[360px]">
          <img
            src={getBackdropArtwork(movie, isKidsMode)}
            alt={movie.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.28)_36%,rgba(2,6,23,0.92)_100%)]" />

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cx(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em]',
                  isSeries
                    ? 'border-fuchsia-300/25 bg-fuchsia-300/14 text-fuchsia-100'
                    : 'border-sky-300/25 bg-sky-300/14 text-sky-100',
                )}
              >
                {isSeries ? <Tv className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {isSeries ? 'Series' : 'Movie'}
              </span>

              {movie.vote_average && (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/12 px-3.5 py-2 text-sm font-semibold text-amber-50">
                  <Star className="h-4 w-4 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            <h3 className="admin-display mt-5 text-3xl font-semibold text-white sm:text-4xl">
              {movie.title}
            </h3>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="flex flex-wrap gap-2">
              {[getReleaseYear(movie), getRuntimeLabel(movie), ...getGenreNames(movie).slice(0, 2)]
                .filter(Boolean)
                .map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300"
                  >
                    {item}
                  </span>
                ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
              {movie.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  navigate(watchPath);
                  onClose();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-slate-100"
              >
                <Play className="h-4 w-4 fill-current" />
                Play now
              </button>

              <button
                type="button"
                onClick={toggleWatchlist}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                type="button"
                onClick={() => {
                  navigate(detailPath);
                  onClose();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-transparent px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
              >
                Full details
              </button>
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              Preview Notes
            </p>
            <div className="mt-5 space-y-3">
              {[
                { label: 'Type', value: isSeries ? 'Series' : 'Movie' },
                { label: 'Primary genre', value: getGenreNames(movie)[0] || 'Featured' },
                { label: 'Experience', value: isKidsMode ? 'Kids mode filtered' : 'Full catalogue' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-white/10 bg-slate-950/55 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
