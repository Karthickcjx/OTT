import { createElement, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import MovieCard from './MovieCard';
import { useApp } from '../context/AppContext';
import { cx } from '../admin/utils/cx';

export default function MovieRow({
  id,
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
    <section id={id} className="group/row scroll-mt-28">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {kidsRail && (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-50">
                <Sparkles className="h-3.5 w-3.5" />
                Kids
              </span>
            )}

            <h2 className={cx('admin-display text-2xl font-bold sm:text-3xl', isLight ? 'text-slate-900' : 'text-white')}>
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
                'flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ease-in-out hover:-translate-y-0.5',
                isLight
                  ? 'border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                  : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-fuchsia-300/30 hover:bg-white/[0.08] hover:text-white',
              )}
              aria-label={label}
            >
              {createElement(Icon, { className: 'h-4 w-4' })}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-14 bg-gradient-to-r from-[#0b0b0f] to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-14 bg-gradient-to-l from-[#0b0b0f] to-transparent lg:block" />

        <div
          ref={rowRef}
          className="scrollbar-hide flex snap-x gap-4 overflow-x-auto px-1 pb-6 pt-1 sm:gap-5"
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
