import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useContentDetails } from '../hooks/useContentDetails';
import { useApp } from '../context/AppContext';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeList from '../components/EpisodeList';
import MovieRow from '../components/MovieRow';
import Loader from '../components/Loader';

function MovieWatchLayout({ content, similar }) {
  return (
    <>
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
        <VideoPlayer title={content.title} videoUrl={content.videoUrl} />
      </div>

      <div className="mt-5">
        <h1 className="text-white text-xl font-bold">{content.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1.5">
          <span>{(content.release_date ?? content.releaseYear + '-01-01')?.slice(0, 4)}</span>
          {content.runtime && <span>{content.runtime} min</span>}
          <span className="text-yellow-400 font-semibold">★ {content.vote_average?.toFixed(1)}</span>
        </div>
        <p className="text-gray-400 mt-2.5 text-sm leading-relaxed max-w-2xl line-clamp-2">{content.overview}</p>
      </div>

      {similar.length > 0 && (
        <div className="mt-8">
          <MovieRow title="Up Next" movies={similar} />
        </div>
      )}
    </>
  );
}

function SeriesWatchLayout({ content, activeSeason, activeEpisode, onEpisodeSelect, onSeasonChange, similar }) {
  const navigate = useNavigate();

  const currentSeasonObj = content.seasons?.find((s) => s.seasonNumber === activeSeason);
  const currentEpObj = currentSeasonObj?.episodes?.find((e) => e.episodeNumber === activeEpisode);

  const handleAutoplayNext = useCallback(() => {
    if (!currentSeasonObj) return;
    const nextEp = currentSeasonObj.episodes.find((e) => e.episodeNumber === activeEpisode + 1);
    if (nextEp) {
      onEpisodeSelect(activeSeason, nextEp.episodeNumber);
      return;
    }
    // Try next season
    const nextSeason = content.seasons?.find((s) => s.seasonNumber === activeSeason + 1);
    if (nextSeason?.episodes?.[0]) {
      onEpisodeSelect(nextSeason.seasonNumber, nextSeason.episodes[0].episodeNumber);
    }
  }, [activeSeason, activeEpisode, currentSeasonObj, content.seasons, onEpisodeSelect]);

  const title = currentEpObj
    ? `${content.title} · S${activeSeason}E${activeEpisode} – ${currentEpObj.title || `Episode ${activeEpisode}`}`
    : content.title;

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      {/* Main player column */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
          <VideoPlayer
            title={title}
            videoUrl={currentEpObj?.videoUrl}
            onEnded={handleAutoplayNext}
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/20 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              Series
            </span>
            <span>Season {activeSeason} · Episode {activeEpisode}</span>
          </div>
          <h1 className="text-white text-xl font-bold">{title}</h1>
          {currentEpObj?.duration && (
            <p className="text-gray-500 text-sm mt-1">{currentEpObj.duration} min</p>
          )}
          <p className="text-gray-400 mt-2 text-sm leading-relaxed max-w-2xl line-clamp-2">{content.overview}</p>
        </div>

        {/* Autoplay next indicator */}
        {currentSeasonObj && (() => {
          const nextEp = currentSeasonObj.episodes.find((e) => e.episodeNumber === activeEpisode + 1);
          const nextSeason = !nextEp && content.seasons?.find((s) => s.seasonNumber === activeSeason + 1);
          const nextItem = nextEp || nextSeason?.episodes?.[0];
          if (!nextItem) return null;
          return (
            <button
              onClick={handleAutoplayNext}
              className="mt-4 flex items-center gap-3 bg-gray-800/80 hover:bg-gray-800 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-300 hover:text-white transition-all w-fit"
            >
              <svg className="w-4 h-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7zM6 5H4v14h2z" />
              </svg>
              <span>
                Next:{' '}
                <span className="text-white font-medium">
                  {nextEp
                    ? `E${nextItem.episodeNumber} – ${nextItem.title || `Episode ${nextItem.episodeNumber}`}`
                    : `Season ${activeSeason + 1} E1`}
                </span>
              </span>
            </button>
          );
        })()}
      </div>

      {/* Episode list sidebar */}
      <div className="xl:w-80 flex-shrink-0">
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
  const navigate = useNavigate();

  const typeHint = searchParams.get('type') ?? 'movie';
  const { content, similar, loading } = useContentDetails(id, typeHint);
  const { addRecentlyWatched } = useApp();

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
  if (!content) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Content not found.</div>
  );

  const isSeries = content.type === 'series';
  const backTo = isSeries ? `/series/${id}` : `/movie/${id}`;

  return (
    <div className="min-h-screen pt-16 bg-black">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
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
          />
        ) : (
          <MovieWatchLayout content={content} similar={similar} />
        )}

        <div className="mt-4 bg-gray-900/50 rounded-lg p-3 border border-white/5">
          <p className="text-gray-600 text-xs text-center">
            Demo player — connect a real video source to the{' '}
            <code className="text-blue-400 bg-black/40 px-1 rounded">videoUrl</code> prop.
          </p>
        </div>
      </div>
    </div>
  );
}
