import { useState, useEffect } from 'react';
import { fetchMovieById } from '../services/movieService';

/**
 * Fetches a single movie's full details from GET /movies/:id
 */
export function useMovieDetails(id) {
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMovieById(id)
      .then((data) => {
        if (cancelled) return;
        setMovie(data);

        // If backend returns similarMovies or related, use those
        const relatedItems =
          data.similarMovies || data.similar || data.recommendations || [];
        setSimilar(Array.isArray(relatedItems) ? relatedItems.slice(0, 12) : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { movie, similar, loading, error };
}
