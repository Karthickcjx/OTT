import { Check, Info, Play, Star, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  getPrimaryGenre,
  getReleaseYear,
} from '../utils/contentExperience';
import { getPosterArtwork } from '../utils/streamArtwork';
import { cx } from '../admin/utils/cx';

function RatingBadge({ score }) {
  if (!score) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-300/12 px-2.5 py-1 text-[11px] font-semibold text-amber-50 shadow-[0_0_22px_-16px_rgba(251,191,36,0.95)]">
      <Star className="h-3 w-3 fill-current" />
      {score.toFixed(1)}
    </span>
  );
}

export default function MovieCard({ movie, variant = 'default', onPreview }) {
  const navigate = useNavigate();
  const { isInWatchlist, settings, isKidsMode } = useApp();
  const isLight = settings.theme === 'light' && !isKidsMode;
  const kidsCard = variant === 'kids';

  const isSeries = movie.type === 'series';
  const inWatchlist = isInWatchlist(movie.id);
  const detailPath = isSeries ? `/series/${movie.id}` : `/movie/${movie.id}`;
  const watchPath = isSeries
    ? `/watch/${movie.id}?type=series&season=1&episode=1`
    : `/watch/${movie.id}`;

  return (
    <article
      className={cx(
        'group/card relative flex-shrink-0 snap-start cursor-pointer',
        kidsCard ? 'w-[280px] sm:w-[320px] lg:w-[360px]' : 'w-64 sm:w-72 lg:w-80',
      )}
      onClick={() => navigate(detailPath)}
    >
      <div
        className={cx(
          'relative overflow-hidden border transition-transform duration-300 ease-in-out group-hover/card:z-10 group-hover/card:scale-110',
          kidsCard
            ? 'aspect-video rounded-[16px] border-amber-300/18 bg-white/[0.06] group-hover/card:shadow-[0_26px_70px_-38px_rgba(251,191,36,0.45)]'
            : 'aspect-video rounded-xl border-white/10 bg-white/[0.05] group-hover/card:border-fuchsia-300/28 group-hover/card:shadow-[0_24px_70px_-36px_rgba(236,72,153,0.55)]',
        )}
      >
        <img
          src={getPosterArtwork(movie, kidsCard)}
          alt={movie.title}
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-16-9.svg'; }}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={cx(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]',
                isSeries
                  ? 'border-fuchsia-300/25 bg-fuchsia-300/14 text-fuchsia-100'
                  : kidsCard
                  ? 'border-amber-300/25 bg-amber-300/14 text-amber-50'
                  : 'border-fuchsia-300/25 bg-fuchsia-300/14 text-fuchsia-100',
              )}
            >
              {isSeries ? <Tv className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
              {isSeries ? 'Series' : 'Movie'}
            </span>

            {inWatchlist && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-50">
                <Check className="h-3 w-3" />
                Saved
              </span>
            )}
          </div>

          <RatingBadge score={movie.vote_average} />
        </div>

        <div className="absolute inset-x-4 bottom-4">
          <div className="translate-y-3 opacity-0 transition-all duration-300 ease-in-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(watchPath);
                }}
                className="playnix-button-primary inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-[1.02]"
              >
                <Play className="h-4 w-4 fill-current" />
                Play
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  if (onPreview) {
                    onPreview(movie);
                    return;
                  }

                  navigate(detailPath);
                }}
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.08] px-4 py-2.5 text-white transition-all duration-300 ease-in-out hover:border-fuchsia-300/30 hover:bg-white/[0.14]"
                aria-label={`Open info for ${movie.title}`}
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
            {movie.title}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            {getPrimaryGenre(movie)} | {getReleaseYear(movie)}
          </p>
        </div>
      </div>

      <div className="px-1 pt-3">
        <p className={cx('text-xs font-medium uppercase tracking-[0.18em]', isLight ? 'text-slate-500' : 'text-slate-500')}>
          {kidsCard ? 'Family safe pick' : isSeries ? 'Binge worthy' : 'Featured selection'}
        </p>
      </div>
    </article>
  );
}
