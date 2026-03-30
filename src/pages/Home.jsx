import { useState } from 'react';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import Modal from '../components/Modal';
import { BannerSkeleton, RowSkeleton } from '../components/Loader';
import { useMovieRows } from '../hooks/useMovies';

export default function Home() {
  const { rows, loading } = useMovieRows();
  const [previewMovie, setPreviewMovie] = useState(null);

  const featuredMovie = rows.trending?.[0] || null;

  if (loading) {
    return (
      <div className="pt-0">
        <BannerSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    );
  }

  return (
    <div>
      <Banner movie={featuredMovie} />

      <div className="relative z-10 -mt-16 pb-8">
        <MovieRow title="Trending Now" movies={rows.trending} />
        <MovieRow title="Series" movies={rows.series} />
        <MovieRow title="Popular Movies" movies={rows.popular} />
        <MovieRow title="Top Rated" movies={rows.topRated} />
        <MovieRow title="Now Playing" movies={rows.nowPlaying} />
      </div>

      {previewMovie && (
        <Modal movie={previewMovie} onClose={() => setPreviewMovie(null)} />
      )}
    </div>
  );
}
