import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminMovies, fetchAdminSeries,
  deleteMovie, deleteSeries,
  updateMovie, updateSeries,
} from '../services/adminApi';

/**
 * Hook for managing admin content (movies + series).
 * Always fetches from the backend API — no more mock gate.
 */
export function useAdminContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [movies, series] = await Promise.all([
        fetchAdminMovies(),
        fetchAdminSeries(),
      ]);

      // Ensure type field for filtering
      const taggedMovies = (movies || []).map((m) => ({ ...m, type: m.type || 'movie' }));
      const taggedSeries = (series || []).map((s) => ({ ...s, type: s.type || 'series' }));

      setContent([...taggedMovies, ...taggedSeries]);
    } catch (err) {
      setError(err?.response?.data?.message || err.friendlyMessage || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = useCallback(async (item) => {
    if (item.type === 'series') await deleteSeries(item.id);
    else await deleteMovie(item.id);
    setContent((prev) => prev.filter((c) => c.id !== item.id));
  }, []);

  const update = useCallback(async (id, type, payload) => {
    const updated = type === 'series'
      ? await updateSeries(id, payload)
      : await updateMovie(id, payload);
    setContent((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  }, []);

  const addItem = useCallback((item) => {
    setContent((prev) => [item, ...prev]);
  }, []);

  const movies = content.filter((c) => c.type === 'movie');
  const series = content.filter((c) => c.type === 'series');

  return { content, movies, series, loading, error, reload: load, remove, update, addItem };
}
