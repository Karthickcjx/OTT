import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMG_BASE } from '../services/tmdb';
import { useApp } from '../context/AppContext';
import { PLACEHOLDER_COLORS } from '../services/mockData';

export default function Modal({ movie, onClose }) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp();

  const inWatchlist = movie ? isInWatchlist(movie.id) : false;
  const colorClass = movie ? PLACEHOLDER_COLORS[movie.id % PLACEHOLDER_COLORS.length] : '';
  const backdropUrl = movie?.backdrop_path
    ? `${IMG_BASE}/w780${movie.backdrop_path}`
    : null;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!movie) return null;

  const toggleWatchlist = () => {
    if (inWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative bg-gray-900 rounded-xl overflow-hidden w-full max-w-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-52 overflow-hidden">
          {backdropUrl ? (
            <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colorClass}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />

          <div className="absolute bottom-4 left-5">
            <h3 className="text-white text-2xl font-bold drop-shadow">{movie.title}</h3>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="text-yellow-400 font-semibold flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
              </svg>
              {movie.vote_average?.toFixed(1)}
            </span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            <div className="flex gap-2">
              {movie.genres?.slice(0, 2).map((g) => (
                <span key={g.id} className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{movie.overview}</p>

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => { navigate(`/watch/${movie.id}`); onClose(); }}
              className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>

            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-2 font-semibold px-5 py-2 rounded-lg border text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                inWatchlist
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-transparent border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {inWatchlist ? 'In Watchlist' : '+ Watchlist'}
            </button>

            <button
              onClick={() => { navigate(`/movie/${movie.id}`); onClose(); }}
              className="ml-auto text-gray-400 hover:text-white text-sm underline transition-colors"
            >
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
