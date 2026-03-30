import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { IMG_BASE } from '../services/tmdb';
import { PLACEHOLDER_COLORS } from '../services/mockData';

function MovieThumb({ movie, onRemove, showRemove }) {
  const navigate = useNavigate();
  const colorClass = PLACEHOLDER_COLORS[movie.id % PLACEHOLDER_COLORS.length];

  return (
    <div className="relative flex-shrink-0 w-32 md:w-40 group cursor-pointer">
      <div
        className="rounded-lg overflow-hidden aspect-[2/3] transition-transform duration-200 group-hover:scale-105"
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        {movie.poster_path ? (
          <img
            src={`${IMG_BASE}/w342${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-end p-2`}>
            <span className="text-white text-xs font-semibold line-clamp-3">{movie.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-10 h-10 text-white fill-current drop-shadow" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {showRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(movie.id); }}
          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          title="Remove"
        >
          <svg className="w-3 h-3 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <p className="text-white text-xs font-medium mt-1.5 truncate px-0.5">{movie.title}</p>
    </div>
  );
}

function EmptyState({ message, linkTo, linkLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-gray-600 fill-current" viewBox="0 0 24 24">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
      {linkTo && (
        <Link to={linkTo} className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, watchlist, recentlyWatched, removeFromWatchlist, logout } = useApp();
  const [tab, setTab] = useState('watchlist');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view your profile</p>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'watchlist', label: `Watchlist (${watchlist.length})` },
    { id: 'recent', label: `Recently Watched (${recentlyWatched.length})` },
  ];

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-900/30">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 border border-red-900/40 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

        <div className="flex gap-1 mb-8 bg-gray-900/50 p-1 rounded-xl w-fit">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'watchlist' && (
          watchlist.length === 0 ? (
            <EmptyState
              message="Your watchlist is empty"
              linkTo="/"
              linkLabel="Browse movies to add"
            />
          ) : (
            <div className="flex flex-wrap gap-4">
              {watchlist.map((movie) => (
                <MovieThumb
                  key={movie.id}
                  movie={movie}
                  showRemove
                  onRemove={removeFromWatchlist}
                />
              ))}
            </div>
          )
        )}

        {tab === 'recent' && (
          recentlyWatched.length === 0 ? (
            <EmptyState
              message="You haven't watched anything yet"
              linkTo="/"
              linkLabel="Start watching"
            />
          ) : (
            <div className="flex flex-wrap gap-4">
              {recentlyWatched.map((movie) => (
                <MovieThumb key={movie.id} movie={movie} showRemove={false} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
