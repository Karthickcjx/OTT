import { useState, useEffect } from 'react';
import { fetchMovieById, fetchSeriesById } from '../services/movieService';

/**
 * Unified hook for both movie and series detail pages.
 * Fetches from GET /movies/:id or GET /series/:id based on typeHint.
 */
export function useContentDetails(id, typeHint = null) {
  const [content, setContent] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchFn = typeHint === 'series' ? fetchSeriesById : fetchMovieById;

    fetchFn(id)
      .then((data) => {
        if (cancelled) return;
        setContent({ ...data, type: typeHint || data.type || 'movie' });

        const relatedItems =
          data.similarMovies || data.similarSeries || data.similar || data.recommendations || [];
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
  }, [id, typeHint]);

  return { content, similar, loading, error };
}
