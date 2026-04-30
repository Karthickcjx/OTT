import { useEffect, useState } from 'react';
import { fetchMovies, fetchSeries } from '../services/movieService';
import { MOCK_MOVIES, MOCK_SERIES } from '../services/mockData';
import { normalizeContent } from '../utils/contentExperience';

const INITIAL_ROWS = {
  trending: [],
  popular: [],
  topRated: [],
  nowPlaying: [],
  series: [],
};

/**
 * Fetches movies + series from the Spring Boot backend
 * and organizes them into display rows for the home page.
 */
export function useMovieRows() {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [movies, series] = await Promise.all([
          fetchMovies(),
          fetchSeries(),
        ]);

        if (cancelled) return;

        // Normalize all content to ensure `type` field is present
        const normalizedMovies = (movies || []).map(normalizeContent);
        const normalizedSeries = (series || []).map(normalizeContent);

        // Distribute movies across rows for home page variety
        const sortedByRating = [...normalizedMovies].sort(
          (a, b) => (b.vote_average || b.rating || 0) - (a.vote_average || a.rating || 0),
        );
        const sortedByDate = [...normalizedMovies].sort(
          (a, b) =>
            new Date(b.release_date || b.releaseYear || 0).getTime() -
            new Date(a.release_date || a.releaseYear || 0).getTime(),
        );

        setRows({
          trending: normalizedMovies.slice(0, 10),
          popular: sortedByRating.slice(0, 10),
          topRated: sortedByRating.slice(0, 8),
          nowPlaying: sortedByDate.slice(0, 8),
          series: normalizedSeries,
        });
      } catch (nextError) {
        if (!cancelled) {
          const fallbackMovies = MOCK_MOVIES.map(normalizeContent);
          const fallbackSeries = MOCK_SERIES.map(normalizeContent);
          const sortedByRating = [...fallbackMovies].sort(
            (a, b) => (b.vote_average || b.rating || 0) - (a.vote_average || a.rating || 0),
          );
          const sortedByDate = [...fallbackMovies].sort(
            (a, b) =>
              new Date(b.release_date || b.releaseYear || 0).getTime() -
              new Date(a.release_date || a.releaseYear || 0).getTime(),
          );

          setRows({
            trending: fallbackMovies.slice(0, 10),
            popular: sortedByRating.slice(0, 10),
            topRated: sortedByRating.slice(0, 8),
            nowPlaying: sortedByDate.slice(0, 8),
            series: fallbackSeries,
          });
          setError(nextError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, loading, error };
}
