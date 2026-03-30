import { useState, useEffect } from 'react';
import { fetchMovieDetails, fetchSimilar } from '../services/tmdb';
import { MOCK_MOVIES, MOCK_SERIES } from '../services/mockData';

const USE_MOCK = !import.meta.env.VITE_TMDB_API_KEY;

/**
 * Unified hook for both movie and series detail pages.
 * Detects content type from the mock catalog or a type hint.
 */
export function useContentDetails(id, typeHint = null) {
  const [content, setContent] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    if (USE_MOCK) {
      const numId = Number(id);
      const found =
        MOCK_SERIES.find((s) => s.id === numId) ||
        MOCK_MOVIES.find((m) => m.id === numId);

      if (found) {
        setContent(found);
        const pool = found.type === 'series'
          ? MOCK_SERIES.filter((s) => s.id !== numId).slice(0, 6)
          : MOCK_MOVIES.filter((m) => m.id !== numId).slice(0, 6);
        setSimilar(pool);
      } else {
        setContent(MOCK_MOVIES[0]);
        setSimilar(MOCK_MOVIES.slice(1, 7));
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([fetchMovieDetails(id), fetchSimilar(id)])
      .then(([details, sim]) => {
        setContent({ ...details, type: typeHint ?? 'movie' });
        setSimilar(sim.slice(0, 12));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id, typeHint]);

  return { content, similar, loading, error };
}
