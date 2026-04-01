import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentDetails } from '../hooks/useContentDetails';
import { useApp } from '../context/AppContext';
import MovieRow from '../components/MovieRow';
import Loader from '../components/Loader';
import { getBackdropArtwork } from '../utils/streamArtwork';
import { PLACEHOLDER_COLORS } from '../services/mockData';

export default function SeriesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content: series, similar, loading, error } = useContentDetails(id, 'series');
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp();

  const [activeSeason, setActiveSeason] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-3">
        <p className="text-xl font-semibold text-red-400">Failed to load series</p>
        <p className="text-sm">{error.friendlyMessage || 'Something went wrong'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  if (!series) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Series not found.</div>
  );

  const inWatchlist = isInWatchlist(series.id);
  const colorClass = PLACEHOLDER_COLORS[series.id % PLACEHOLDER_COLORS.length];
  const backdropUrl = !imgError ? getBackdropArtwork(series) : null;

  const genres = series.genres || (series.genre ? [{ id: 1, name: series.genre }] : []);
  const currentSeason = series.seasons?.find((s) => s.seasonNumber === activeSeason);
  const firstEpisode = currentSeason?.episodes?.[0];

  const toggleWatchlist = () => {
    if (inWatchlist) removeFromWatchlist(series.id);
    else addToWatchlist({ ...series, type: 'series' });
  };

  const playEpisode = (seasonNum, epNum) => {
    navigate(`/watch/${series.id}?type=series&season=${seasonNum}&episode=${epNum}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        {backdropUrl ? (
          <img src={backdropUrl} alt={series.title} className="absolute inset-0 w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${colorClass}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

        <div className="absolute bottom-10 left-6 md:left-12 max-w-2xl z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 text-xs font-semibold px-2.5 py-1 rounded-full">
              SERIES
            </span>
            {genres.slice(0, 2).map((g) => (
              <span key={g.id || g.name} className="text-xs text-gray-400 font-medium">{g.name || g}</span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">{series.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-wrap">
            <span className="text-yellow-400 font-semibold flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
              {(series.vote_average || series.rating)?.toFixed?.(1) || 'N/A'}
            </span>
            <span>{String(series.release_date || series.releaseYear || '').slice(0, 4)}</span>
            {series.seasons?.length > 0 && (
              <span>{series.seasons.length} Season{series.seasons.length !== 1 ? 's' : ''}</span>
            )}
            {series.seasons && (
              <span className="text-gray-500">
                {series.seasons.reduce((s, x) => s + (x.episodes?.length || 0), 0)} Episodes
              </span>
            )}
          </div>

          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-6 max-w-lg">
            {series.overview || series.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {firstEpisode && (
              <button
                onClick={() => playEpisode(activeSeason, firstEpisode.episodeNumber)}
                className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2.5 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Play S1E1
              </button>
            )}
            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-2 font-semibold px-6 py-2.5 rounded-lg border transition-all hover:scale-105 active:scale-95 ${
                inWatchlist
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {inWatchlist
                ? <><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></svg>In Watchlist</>
                : <><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>Watchlist</>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Content below fold */}
      <div className="px-6 md:px-12 py-10 max-w-6xl space-y-10">
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">About</h2>
          <p className="text-gray-300 leading-relaxed">{series.overview || series.description}</p>
        </div>

        {series.seasons?.length > 0 && (
          <div>
            {/* Season tabs */}
            {series.seasons.length > 1 && (
              <div className="flex gap-2 mb-5 flex-wrap">
                {series.seasons.map((s) => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => setActiveSeason(s.seasonNumber)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                      activeSeason === s.seasonNumber
                        ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                        : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    Season {s.seasonNumber}
                    <span className="ml-1.5 text-xs opacity-60">{s.episodes?.length || 0}ep</span>
                  </button>
                ))}
              </div>
            )}

            {/* Episode grid */}
            <div className="space-y-1">
              {currentSeason?.episodes?.map((ep) => (
                <button
                  key={ep.episodeNumber}
                  onClick={() => playEpisode(activeSeason, ep.episodeNumber)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 fill-current transition-colors" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500 text-xs font-mono">E{ep.episodeNumber}</span>
                      <span className="text-white text-sm font-medium truncate">{ep.title || `Episode ${ep.episodeNumber}`}</span>
                    </div>
                  </div>
                  <span className="text-gray-600 text-xs flex-shrink-0">{ep.duration ? `${ep.duration} min` : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {similar.length > 0 && (
        <div className="pb-10">
          <MovieRow title="More Like This" movies={similar} />
        </div>
      )}
    </div>
  );
}
