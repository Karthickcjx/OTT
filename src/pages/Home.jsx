import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import Modal from '../components/Modal';
import { BannerSkeleton, RowSkeleton } from '../components/Loader';
import { useMovieRows } from '../hooks/useMovies';
import { useApp } from '../context/AppContext';
import { buildShowcaseRows } from '../utils/contentExperience';
import { cx } from '../admin/utils/cx';

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

      <div className="relative z-10 mt-12 pb-8">
        <div className="mx-auto max-w-[1600px] space-y-8 px-4 sm:px-6 lg:px-10">
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
