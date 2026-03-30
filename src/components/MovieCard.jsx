import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMG_BASE } from '../services/tmdb';
import { PLACEHOLDER_COLORS } from '../services/mockData';

function StarRating({ score }) {
  return (
    <span className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
      </svg>
      {score?.toFixed(1)}
    </span>
  );
}

export default function MovieCard({ movie, index = 0 }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isSeries = movie.type === 'series';
  const detailPath = isSeries ? `/series/${movie.id}` : `/movie/${movie.id}`;
  const watchPath = isSeries
    ? `/watch/${movie.id}?type=series&season=1&episode=1`
    : `/watch/${movie.id}`;

  const colorClass = PLACEHOLDER_COLORS[movie.id % PLACEHOLDER_COLORS.length];
  const posterUrl =
    movie.poster_path && !imgError
      ? `${IMG_BASE}/w342${movie.poster_path}`
      : null;

  return (
    <div
      className="flex-shrink-0 w-36 md:w-44 cursor-pointer group"
      onClick={() => navigate(detailPath)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative rounded-lg overflow-hidden aspect-[2/3] transition-transform duration-300 ${
          hovered ? 'scale-105 shadow-2xl shadow-black/60 z-10' : 'scale-100'
        }`}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-end p-3`}>
            <span className="text-white text-xs font-semibold line-clamp-3 leading-tight">
              {movie.title}
            </span>
          </div>
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              navigate(watchPath);
            }}
          >
            <svg className="w-5 h-5 text-black fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        <div className="absolute top-2 right-2">
          <StarRating score={movie.vote_average} />
        </div>

        {isSeries && (
          <div className="absolute top-2 left-2">
            <span className="bg-purple-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
              Series
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-white text-xs font-medium truncate group-hover:text-blue-400 transition-colors">
          {movie.title}
        </p>
        <p className="text-gray-500 text-xs mt-0.5">
          {movie.release_date?.slice(0, 4)}
        </p>
      </div>
    </div>
  );
}
