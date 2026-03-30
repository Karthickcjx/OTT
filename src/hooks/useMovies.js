import { useEffect, useState } from 'react';
import {
  fetchNowPlaying,
  fetchPopular,
  fetchTopRated,
  fetchTrending,
} from '../services/tmdb';
import { MOCK_MOVIES, MOCK_SERIES } from '../services/mockData';
import { normalizeContent } from '../utils/contentExperience';

const USE_MOCK = !import.meta.env.VITE_TMDB_API_KEY;

const INITIAL_ROWS = {
  trending: [],
  popular: [],
  topRated: [],
  nowPlaying: [],
  series: [],
};

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
        if (USE_MOCK) {
          await Promise.resolve();
          if (cancelled) return;

          setRows({
            trending: MOCK_MOVIES.slice(0, 8).map(normalizeContent),
            popular: [...MOCK_MOVIES].reverse().slice(0, 8).map(normalizeContent),
            topRated: MOCK_MOVIES.filter((_, index) => index % 2 === 0).map(normalizeContent),
            nowPlaying: MOCK_MOVIES.filter((_, index) => index % 2 !== 0).map(normalizeContent),
            series: MOCK_SERIES.map(normalizeContent),
          });
          return;
        }

        const [trending, popular, topRated, nowPlaying] = await Promise.all([
          fetchTrending(),
          fetchPopular(),
          fetchTopRated(),
          fetchNowPlaying(),
        ]);

        if (cancelled) return;

        setRows({
          trending: trending.map(normalizeContent),
          popular: popular.map(normalizeContent),
          topRated: topRated.map(normalizeContent),
          nowPlaying: nowPlaying.map(normalizeContent),
          series: MOCK_SERIES.map(normalizeContent),
        });
      } catch (nextError) {
        if (!cancelled) setError(nextError);
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
