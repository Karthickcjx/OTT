import { useRef } from 'react';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies = [] }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (!movies.length) return null;

  return (
    <section className="relative py-6 group/row">
      <h2 className="text-white text-lg md:text-xl font-semibold px-6 md:px-12 mb-4">
        {title}
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/70 hover:bg-black/90 border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 -translate-x-1"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={rowRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-2"
        >
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/70 hover:bg-black/90 border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 translate-x-1"
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
