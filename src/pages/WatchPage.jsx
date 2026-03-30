import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useContentDetails } from '../hooks/useContentDetails';
import { useApp } from '../context/AppContext';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeList from '../components/EpisodeList';
import MovieRow from '../components/MovieRow';
import Loader from '../components/Loader';
import { cx } from '../admin/utils/cx';

function MovieWatchLayout({ content, similar }) {
  return (
    <>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/72 shadow-[0_36px_90px_-52px_rgba(15,23,42,0.98)]">
        <VideoPlayer title={content.title} videoUrl={content.videoUrl} />
      </div>

      <div className="mt-6">
        <h1 className="admin-display text-2xl font-semibold text-white sm:text-3xl">{content.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span>{(content.release_date || `${content.releaseYear || ''}-01-01`).slice(0, 4)}</span>
          {content.runtime && <span>{content.runtime} min</span>}
          <span className="font-semibold text-amber-300">Rating {content.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">{content.overview}</p>
      </div>

      {similar.length > 0 && (
        <div className="mt-10">
          <MovieRow title="Up Next" subtitle="Keep the momentum going with related picks." movies={similar} />
        </div>
      )}
    </>
  );
}

function SeriesWatchLayout({
  content,
  activeSeason,
  activeEpisode,
  onEpisodeSelect,
  onSeasonChange,
  similar,
  autoplay,
}) {
  const currentSeasonObj = content.seasons?.find((season) => season.seasonNumber === activeSeason);
  const currentEpisode = currentSeasonObj?.episodes?.find((episode) => episode.episodeNumber === activeEpisode);

  const handleAutoplayNext = useCallback(() => {
    if (!currentSeasonObj) return;

    const nextEpisode = currentSeasonObj.episodes.find(
      (episode) => episode.episodeNumber === activeEpisode + 1,
    );

    if (nextEpisode) {
      onEpisodeSelect(activeSeason, nextEpisode.episodeNumber);
      return;
    }

    const nextSeason = content.seasons?.find((season) => season.seasonNumber === activeSeason + 1);
    if (nextSeason?.episodes?.[0]) {
      onEpisodeSelect(nextSeason.seasonNumber, nextSeason.episodes[0].episodeNumber);
    }
  }, [activeEpisode, activeSeason, content.seasons, currentSeasonObj, onEpisodeSelect]);

  const episodeTitle = currentEpisode
    ? `${content.title} | S${activeSeason}E${activeEpisode} | ${currentEpisode.title || `Episode ${activeEpisode}`}`
    : content.title;

  const nextEpisode = currentSeasonObj?.episodes.find(
    (episode) => episode.episodeNumber === activeEpisode + 1,
  );
  const nextSeason = !nextEpisode && content.seasons?.find(
    (season) => season.seasonNumber === activeSeason + 1,
  );
  const autoplayLabel = nextEpisode
    ? `Next: E${nextEpisode.episodeNumber} | ${nextEpisode.title || `Episode ${nextEpisode.episodeNumber}`}`
    : nextSeason?.episodes?.[0]
    ? `Next: Season ${nextSeason.seasonNumber} | Episode 1`
    : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/72 shadow-[0_36px_90px_-52px_rgba(15,23,42,0.98)]">
          <VideoPlayer
            title={episodeTitle}
            videoUrl={currentEpisode?.videoUrl}
            onEnded={autoplay ? handleAutoplayNext : undefined}
          />
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-fuchsia-300/25 bg-fuchsia-300/14 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-fuchsia-100">
              Series
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300">
              Season {activeSeason} | Episode {activeEpisode}
            </span>
            {autoplay && autoplayLabel && (
              <button
                type="button"
                onClick={handleAutoplayNext}
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/12 px-3 py-1.5 text-xs font-semibold text-sky-100 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-sky-300/18"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                {autoplayLabel}
              </button>
            )}
          </div>

          <h1 className="admin-display mt-4 text-2xl font-semibold text-white sm:text-3xl">
            {episodeTitle}
          </h1>
          {currentEpisode?.duration && (
            <p className="mt-2 text-sm text-slate-500">{currentEpisode.duration} min</p>
          )}
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">{content.overview}</p>
        </div>

        {similar.length > 0 && (
          <div className="mt-10">
            <MovieRow title="More to binge" subtitle="Related picks once this episode ends." movies={similar} />
          </div>
        )}
      </div>

      <div className="xl:sticky xl:top-24 xl:h-fit">
        <EpisodeList
          seasons={content.seasons}
          activeSeason={activeSeason}
          activeEpisode={activeEpisode}
          onEpisodeSelect={onEpisodeSelect}
          onSeasonChange={onSeasonChange}
        />
      </div>
    </div>
  );
}

export default function WatchPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeHint = searchParams.get('type') ?? 'movie';
  const { content, similar, loading } = useContentDetails(id, typeHint);
  const { addRecentlyWatched, settings, isKidsMode } = useApp();

  const [activeSeason, setActiveSeason] = useState(() => Number(searchParams.get('season') ?? 1));
  const [activeEpisode, setActiveEpisode] = useState(() => Number(searchParams.get('episode') ?? 1));

  useEffect(() => {
    if (content) addRecentlyWatched(content);
  }, [content, addRecentlyWatched]);

  const handleEpisodeSelect = useCallback((season, episode) => {
    setActiveSeason(season);
    setActiveEpisode(episode);
    setSearchParams({ type: 'series', season, episode });
  }, [setSearchParams]);

  const handleSeasonChange = useCallback((season) => {
    setActiveSeason(season);
    setActiveEpisode(1);
    setSearchParams({ type: 'series', season, episode: 1 });
  }, [setSearchParams]);

  if (loading) return <Loader />;

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-slate-400">
        Content not found.
      </div>
    );
  }

  const isSeries = content.type === 'series';
  const backTo = isSeries ? `/series/${id}` : `/movie/${id}`;

  return (
    <div className="px-4 pb-16 pt-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <Link
          to={backTo}
          className={cx(
            'mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5',
            isKidsMode
              ? 'border-amber-300/20 bg-amber-300/10 text-amber-50 hover:bg-amber-300/16'
              : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to details
        </Link>

        {isSeries ? (
          <SeriesWatchLayout
            content={content}
            activeSeason={activeSeason}
            activeEpisode={activeEpisode}
            onEpisodeSelect={handleEpisodeSelect}
            onSeasonChange={handleSeasonChange}
            similar={similar}
            autoplay={settings.autoplay}
          />
        ) : (
          <MovieWatchLayout content={content} similar={similar} />
        )}

        <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-xs text-slate-500">
          Demo player mode: connect a real `videoUrl` source when you are ready for production playback.
        </div>
      </div>
    </div>
  );
}
