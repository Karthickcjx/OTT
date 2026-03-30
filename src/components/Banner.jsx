import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMG_BASE } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { PLACEHOLDER_COLORS } from '../services/mockData';

export default function Banner({ movie }) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp();
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);
  const colorClass = PLACEHOLDER_COLORS[movie.id % PLACEHOLDER_COLORS.length];
  const backdropUrl =
    movie.backdrop_path && !imgError
      ? `${IMG_BASE}/original${movie.backdrop_path}`
      : null;

  const toggleWatchlist = () => {
    if (inWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  };

  return (
    <div className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass}`} />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

      <div className="absolute bottom-16 left-6 md:left-12 max-w-2xl z-10">
        <div className="flex items-center gap-2 mb-3">
          {movie.genres?.slice(0, 2).map((g) => (
            <span key={g.id} className="text-xs text-blue-400 font-medium uppercase tracking-wider">
              {g.name}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
          {movie.title}
        </h1>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
          <span className="flex items-center gap-1 text-yellow-400 font-semibold">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
            </svg>
            {movie.vote_average?.toFixed(1)}
          </span>
          <span>{movie.release_date?.slice(0, 4)}</span>
          {movie.runtime && <span>{movie.runtime} min</span>}
        </div>

        <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3 mb-6 max-w-lg">
          {movie.overview}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/watch/${movie.id}`)}
            className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>

          <button
            onClick={toggleWatchlist}
            className={`flex items-center gap-2 font-semibold px-6 py-2.5 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 ${
              inWatchlist
                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {inWatchlist ? (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                In Watchlist
              </>
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Add to Watchlist
              </>
            )}
          </button>

          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
            </svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
