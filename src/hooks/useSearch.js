import { startTransition, useCallback, useEffect, useState } from 'react';
import { searchMovies } from '../services/tmdb';
import { MOCK_MOVIES, MOCK_SERIES } from '../services/mockData';
import { normalizeContent, uniqueContent } from '../utils/contentExperience';

const USE_MOCK = !import.meta.env.VITE_TMDB_API_KEY;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback((nextQuery) => {
    startTransition(() => {
      setQuery(nextQuery);
    });
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const runSearch = async () => {
      if (USE_MOCK) {
        const pool = uniqueContent([...MOCK_MOVIES, ...MOCK_SERIES].map(normalizeContent));
        const filtered = pool
          .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 8);

        if (!cancelled) {
          setResults(filtered);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const data = await searchMovies(query);
        if (!cancelled) {
          setResults(uniqueContent(data.map(normalizeContent)).slice(0, 8));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(runSearch, 260);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { query, results, loading, search };
}
