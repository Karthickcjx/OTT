import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useApp } from '../context/AppContext';
import MovieRow from '../components/MovieRow';
import Loader from '../components/Loader';
import { getBackdropArtwork } from '../utils/streamArtwork';
import { PLACEHOLDER_COLORS } from '../services/mockData';

function GenreBadge({ name }) {
  return (
    <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full border border-white/10">
      {name}
    </span>
  );
}

function CastCard({ member }) {
  return (
    <div className="flex-shrink-0 w-24 text-center">
      <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 overflow-hidden">
        {member.profilePath || member.profile_path ? (
          <img
            src={member.profilePath || member.profile_path}
            alt={member.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
            {member.name?.charAt(0)}
          </div>
        )}
      </div>
      <p className="text-white text-xs font-medium truncate">{member.name}</p>
      <p className="text-gray-500 text-xs truncate">{member.character}</p>
    </div>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, similar, loading, error } = useMovieDetails(id);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useApp();
  const [imgError, setImgError] = useState(false);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-3">
        <p className="text-xl font-semibold text-red-400">Failed to load movie</p>
        <p className="text-sm">{error.friendlyMessage || 'Something went wrong'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 text-fuchsia-300 hover:text-white text-sm"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  if (!movie) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Movie not found.
    </div>
  );

  const inWatchlist = isInWatchlist(movie.id);
  const colorClass = PLACEHOLDER_COLORS[movie.id % PLACEHOLDER_COLORS.length];

  // Use the centralized artwork utility to resolve the best image URL
  const backdropUrl = !imgError ? getBackdropArtwork(movie) : null;

  const genres = movie.genres || (movie.genre ? [{ id: 1, name: movie.genre }] : []);
  const cast = movie.credits?.cast?.slice(0, 10) || movie.cast?.slice(0, 10) || [];
  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  ) || movie.trailerUrl;

  const toggleWatchlist = () => {
    if (inWatchlist) removeFromWatchlist(movie.id);
    else addToWatchlist({ ...movie, type: 'movie' });
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[65vh] min-h-[450px] overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        <div className="absolute bottom-10 left-6 md:left-12 max-w-2xl z-10">
          {genres.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {genres.map((g) => <GenreBadge key={g.id || g.name} name={g.name || g} />)}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            {movie.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-4 flex-wrap">
            <span className="text-yellow-400 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
              </svg>
              {(movie.vote_average || movie.rating)?.toFixed?.(1) || 'N/A'}
            </span>
            {(movie.release_date || movie.releaseYear) && (
              <span>{String(movie.release_date || movie.releaseYear).slice(0, 4)}</span>
            )}
            {(movie.runtime || movie.duration) && (
              <span>{movie.runtime || movie.duration} min</span>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="playnix-button-primary flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </button>
            <button
              onClick={toggleWatchlist}
              className={`flex items-center gap-2 font-semibold px-6 py-2.5 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 ${
                inWatchlist
                  ? 'bg-fuchsia-500/18 border-fuchsia-300/35 text-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {inWatchlist ? (
                <><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></svg>In Watchlist</>
              ) : (
                <><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>Watchlist</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10 max-w-5xl space-y-10">
        <div>
          <h2 className="text-white text-lg font-semibold mb-3">Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            {movie.overview || movie.description}
          </p>
        </div>

        {cast.length > 0 && (
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {cast.map((member, idx) => (
                <CastCard key={member.id || idx} member={member} />
              ))}
            </div>
          </div>
        )}

        {trailer && (
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Trailer</h2>
            <div className="aspect-video max-w-2xl rounded-xl overflow-hidden">
              {typeof trailer === 'string' ? (
                <iframe
                  src={trailer}
                  title="Trailer"
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  className="w-full h-full"
                  allowFullScreen
                />
              )}
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
