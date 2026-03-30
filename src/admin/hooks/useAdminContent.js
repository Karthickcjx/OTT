import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminMovies, fetchAdminSeries,
  deleteMovie, deleteSeries,
  updateMovie, updateSeries,
} from '../services/adminApi';
import { MOCK_ADMIN_MOVIES, MOCK_ADMIN_SERIES } from '../services/mockAdminData';

const USE_MOCK = !import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL === 'http://localhost:8080';

export function useAdminContent() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await delay(400);
        setContent([...MOCK_ADMIN_MOVIES, ...MOCK_ADMIN_SERIES]);
      } else {
        const [movies, series] = await Promise.all([fetchAdminMovies(), fetchAdminSeries()]);
        setContent([...movies, ...series]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = useCallback(async (item) => {
    if (USE_MOCK) {
      setContent((prev) => prev.filter((c) => c.id !== item.id));
      return;
    }
    if (item.type === 'series') await deleteSeries(item.id);
    else await deleteMovie(item.id);
    setContent((prev) => prev.filter((c) => c.id !== item.id));
  }, []);

  const update = useCallback(async (id, type, payload) => {
    if (USE_MOCK) {
      setContent((prev) => prev.map((c) => (c.id === id ? { ...c, ...payload } : c)));
      return;
    }
    const updated = type === 'series'
      ? await updateSeries(id, payload)
      : await updateMovie(id, payload);
    setContent((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const addItem = useCallback((item) => {
    setContent((prev) => [item, ...prev]);
  }, []);

  const movies = content.filter((c) => c.type === 'movie');
  const series = content.filter((c) => c.type === 'series');

  return { content, movies, series, loading, error, reload: load, remove, update, addItem };
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
