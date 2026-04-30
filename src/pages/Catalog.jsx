import { useMemo, useState } from 'react';
import { Clapperboard, Film, Tv } from 'lucide-react';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import MovieRow from '../components/MovieRow';
import { useMovieRows } from '../hooks/useMovies';
import { useApp } from '../context/AppContext';
import { filterContentForProfile, uniqueContent } from '../utils/contentExperience';
import { cx } from '../admin/utils/cx';

export default function Catalog({ type = 'movies' }) {
  const { rows, loading } = useMovieRows();
  const { activeProfile, isKidsMode, settings } = useApp();
  const [previewMovie, setPreviewMovie] = useState(null);
  const isLight = settings.theme === 'light' && !isKidsMode;
  const isSeries = type === 'series';

  const catalogRows = useMemo(() => {
    if (isSeries) {
      const series = filterContentForProfile(rows.series, activeProfile);
      return [
        {
          key: 'series-binge',
          title: 'Binge-Worthy Series',
          subtitle: 'Serialized Playnix stories ready for a long watch.',
          items: series,
        },
        {
          key: 'series-recommended',
          title: 'Recommended Series',
          subtitle: 'High-rated series and profile-friendly picks.',
          items: [...series].sort((left, right) => (right.vote_average || 0) - (left.vote_average || 0)),
        },
      ].filter((row) => row.items.length > 0);
    }

    const trending = filterContentForProfile(rows.trending, activeProfile);
    const recommended = filterContentForProfile(
      uniqueContent([...rows.topRated, ...rows.popular]),
      activeProfile,
    );
    const newReleases = filterContentForProfile(rows.nowPlaying, activeProfile);

    return [
      {
        key: 'movies-trending',
        title: 'Trending Movies',
        subtitle: 'Cinematic picks moving fast across Playnix.',
        items: trending,
      },
      {
        key: 'movies-recommended',
        title: 'Recommended Movies',
        subtitle: 'High-rated features tuned for your profile.',
        items: recommended,
      },
      {
        key: 'movies-new',
        title: 'New Movie Releases',
        subtitle: 'Fresh premieres and recent drops.',
        items: newReleases,
      },
    ].filter((row) => row.items.length > 0);
  }, [activeProfile, isSeries, rows]);

  if (loading) return <Loader />;

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <section className="mb-10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_90px_-58px_rgba(0,0,0,0.96)] backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-300/12 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-fuchsia-100">
                {isSeries ? <Tv className="h-3.5 w-3.5" /> : <Film className="h-3.5 w-3.5" />}
                {isSeries ? 'Series' : 'Movies'}
              </p>
              <h1 className={cx('admin-display mt-5 text-4xl font-black sm:text-5xl', isLight ? 'text-slate-900' : 'text-white')}>
                {isSeries ? 'Series on Playnix' : 'Movies on Playnix'}
              </h1>
              <p className={cx('mt-4 max-w-2xl text-sm leading-7 sm:text-base', isLight ? 'text-slate-600' : 'text-slate-400')}>
                {isSeries
                  ? 'Browse serialized stories, new obsessions, and premium episodic picks.'
                  : 'Browse cinematic features, trending premieres, and profile-aware recommendations.'}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0b0b0f]/60 px-4 py-3">
              <Clapperboard className="h-5 w-5 text-orange-300" />
              <span className="text-sm font-semibold text-slate-300">
                {catalogRows.reduce((total, row) => total + row.items.length, 0)} titles available
              </span>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {catalogRows.map((row, index) => (
            <div
              key={row.key}
              className="animate-[stream-fade-up_0.65s_ease-out]"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <MovieRow
                id={row.key}
                title={row.title}
                subtitle={row.subtitle}
                movies={row.items}
                onPreview={setPreviewMovie}
              />
            </div>
          ))}
        </div>
      </div>

      {previewMovie && (
        <Modal movie={previewMovie} onClose={() => setPreviewMovie(null)} />
      )}
    </div>
  );
}
