import { useState, useEffect, useCallback } from 'react';
import { searchMovies } from '../services/tmdb';
import { MOCK_MOVIES } from '../services/mockData';

const USE_MOCK = !import.meta.env.VITE_TMDB_API_KEY;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback((q) => {
    setQuery(q);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (USE_MOCK) {
      const filtered = MOCK_MOVIES.filter((m) =>
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchMovies(query);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return { query, results, loading, search };
}
