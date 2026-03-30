import { useState, useEffect, useCallback } from 'react';
import { fetchAdminMovies, deleteMovie, updateMovie } from '../services/adminApi';
import { MOCK_ADMIN_MOVIES } from '../services/mockAdminData';

const USE_MOCK = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL === 'http://localhost:8080';

export function useAdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await delay(500);
        setMovies(MOCK_ADMIN_MOVIES);
      } else {
        const data = await fetchAdminMovies();
        setMovies(data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = useCallback(async (id) => {
    if (USE_MOCK) {
      setMovies((prev) => prev.filter((m) => m.id !== id));
      return;
    }
    await deleteMovie(id);
    setMovies((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const update = useCallback(async (id, payload) => {
    if (USE_MOCK) {
      setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...payload } : m)));
      return;
    }
    const updated = await updateMovie(id, payload);
    setMovies((prev) => prev.map((m) => (m.id === id ? updated : m)));
  }, []);

  const addMovie = useCallback((movie) => {
    setMovies((prev) => [movie, ...prev]);
  }, []);

  return { movies, loading, error, reload: load, remove, update, addMovie };
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
