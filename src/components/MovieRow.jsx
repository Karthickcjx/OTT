import { createElement, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import MovieCard from './MovieCard';
import { useApp } from '../context/AppContext';
import { cx } from '../admin/utils/cx';

export default function MovieRow({
  title,
  subtitle,
  movies = [],
  variant = 'default',
  onPreview,
}) {
  const rowRef = useRef(null);
  const { settings, isKidsMode } = useApp();
  const isLight = settings.theme === 'light' && !isKidsMode;
  const kidsRail = variant === 'kids';

    const scroll = (direction) => {
      if (!rowRef.current) return;
      rowRef.current.scrollBy({
        left: direction * (kidsRail ? 680 : 640),
        behavior: 'smooth',
      });
    };

  if (!movies.length) return null;

  return (
    <section className="group/row relative">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {kidsRail && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-50">
                <Sparkles className="h-3.5 w-3.5" />
                Kids
              </span>
            )}

            <h2 className={cx('admin-display text-2xl font-semibold sm:text-3xl', isLight ? 'text-slate-900' : 'text-white')}>
              {title}
            </h2>

            <span
              className={cx(
                'w-fit rounded-full border px-3 py-1 text-xs font-semibold',
                isLight ? 'border-slate-200 bg-white/70 text-slate-600' : 'border-white/10 bg-white/[0.04] text-slate-400',
              )}
            >
              {movies.length} titles
            </span>
          </div>

          {subtitle && (
            <p className={cx('mt-2 max-w-2xl text-sm leading-6', isLight ? 'text-slate-600' : 'text-slate-400')}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {[
            { icon: ChevronLeft, dir: -1, label: 'Scroll left' },
            { icon: ChevronRight, dir: 1, label: 'Scroll right' },
          ].map(({ icon: Icon, dir, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => scroll(dir)}
              className={cx(
                'flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ease-in-out hover:-translate-y-0.5',
                isLight
                  ? 'border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                  : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
              )}
              aria-label={label}
            >
              {createElement(Icon, { className: 'h-4 w-4' })}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cx(
          'relative overflow-hidden rounded-[34px] border p-4 sm:p-5',
          isLight
            ? 'border-slate-200 bg-white/68 shadow-[0_28px_70px_-42px_rgba(37,99,235,0.18)]'
            : kidsRail
            ? 'border-amber-300/18 bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(14,165,233,0.12),rgba(251,191,36,0.08))] backdrop-blur-2xl'
            : 'border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)]',
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-[rgba(2,6,23,0.72)] to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-[rgba(2,6,23,0.72)] to-transparent lg:block" />

        <div
          ref={rowRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-1 pb-2 pt-1 sm:gap-5"
        >
          {movies.map((movie) => (
            <MovieCard
              key={`${title}-${movie.id}`}
              movie={movie}
              variant={variant}
              onPreview={onPreview}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
