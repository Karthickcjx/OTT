import { useMemo, useState } from 'react';
import { Clapperboard, Sparkles, Star } from 'lucide-react';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import Modal from '../components/Modal';
import { BannerSkeleton, RowSkeleton } from '../components/Loader';
import { useMovieRows } from '../hooks/useMovies';
import { useApp } from '../context/AppContext';
import { buildShowcaseRows, getPrimaryGenre } from '../utils/contentExperience';
import { cx } from '../admin/utils/cx';

function ExperienceSummary({ activeProfile, featuredMovie, isKidsMode, isLight }) {
  if (!activeProfile) return null;

  return (
    <section className="stream-glass rounded-[32px] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
            Personalized Stream
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
            />
            <div>
              <h2 className={cx('admin-display text-2xl font-semibold sm:text-3xl', isLight ? 'text-slate-900' : 'text-white')}>
                Welcome back, {activeProfile.name}
              </h2>
              <p className={cx('mt-1 text-sm', isLight ? 'text-slate-600' : 'text-slate-400')}>
                {isKidsMode
                  ? 'A curated kid-safe homepage with brighter picks and friendlier browsing.'
                  : 'Your landing page now blends premium hero content, smart rows, and richer previews.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Profile
            </p>
            <p className={cx('mt-2 text-sm font-semibold capitalize', isLight ? 'text-slate-900' : 'text-white')}>
              {activeProfile.type}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Featured Genre
            </p>
            <p className={cx('mt-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
              {featuredMovie ? getPrimaryGenre(featuredMovie) : 'Curated'}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Mode
            </p>
            <p className={cx('mt-2 inline-flex items-center gap-2 text-sm font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
              {isKidsMode ? <Sparkles className="h-4 w-4 text-amber-300" /> : <Clapperboard className="h-4 w-4 text-sky-300" />}
              {isKidsMode ? 'Kids Safe' : 'Premium OTT'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { rows, loading } = useMovieRows();
  const { activeProfile, isKidsMode, recentlyWatched, settings } = useApp();
  const [previewMovie, setPreviewMovie] = useState(null);
  const isLight = settings.theme === 'light' && !isKidsMode;

  const showcaseRows = useMemo(
    () => buildShowcaseRows(rows, recentlyWatched, activeProfile),
    [activeProfile, recentlyWatched, rows],
  );

  const featuredMovie = showcaseRows[0]?.items?.[0] || null;

  if (loading) {
    return (
      <div className="pt-0">
        <BannerSkeleton />
        <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 sm:px-6 lg:px-10">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-14">
      <Banner
        movie={featuredMovie}
        activeProfile={activeProfile}
        isKidsMode={isKidsMode}
        onPreview={setPreviewMovie}
      />

      <div className={cx('relative z-10 pb-8', isKidsMode ? '-mt-14' : '-mt-24')}>
        <div className="mx-auto max-w-[1600px] space-y-8 px-4 sm:px-6 lg:px-10">
          <ExperienceSummary
            activeProfile={activeProfile}
            featuredMovie={featuredMovie}
            isKidsMode={isKidsMode}
            isLight={isLight}
          />

          {showcaseRows.map((row, index) => (
            <div
              key={row.key}
              className="animate-[stream-fade-up_0.65s_ease-out]"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <MovieRow
                title={row.title}
                subtitle={row.subtitle}
                movies={row.items}
                variant={row.variant}
                onPreview={setPreviewMovie}
              />
            </div>
          ))}

          {!showcaseRows.length && (
            <section className="stream-card rounded-[32px] px-6 py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-200">
                <Star className="h-7 w-7" />
              </div>
              <h2 className={cx('admin-display mt-5 text-3xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
                Fresh profiles, fresh picks
              </h2>
              <p className={cx('mx-auto mt-3 max-w-xl text-sm leading-6', isLight ? 'text-slate-600' : 'text-slate-400')}>
                There is not enough content in this mode yet. Try switching profiles or use search to explore more titles.
              </p>
            </section>
          )}
        </div>
      </div>

      {previewMovie && (
        <Modal movie={previewMovie} onClose={() => setPreviewMovie(null)} />
      )}
    </div>
  );
}
