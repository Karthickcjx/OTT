import { startTransition, useCallback, useEffect, useState } from 'react';
import { searchContent } from '../services/movieService';
import { normalizeContent, uniqueContent } from '../utils/contentExperience';

/**
 * Debounced search hook — uses backend GET /search?q=...
 */
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
    setLoading(true);

    const runSearch = async () => {
      try {
        const data = await searchContent(query);
        if (!cancelled) {
          const items = Array.isArray(data) ? data : data.results || data.content || [];
          setResults(uniqueContent(items.map(normalizeContent)).slice(0, 12));
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(runSearch, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { query, results, loading, search };
}
