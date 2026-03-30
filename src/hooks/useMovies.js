import { useState, useEffect } from 'react';
import {
  fetchTrending,
  fetchPopular,
  fetchTopRated,
  fetchNowPlaying,
} from '../services/tmdb';
import { MOCK_MOVIES, MOCK_SERIES } from '../services/mockData';

const USE_MOCK = !import.meta.env.VITE_TMDB_API_KEY;

export function useMovieRows() {
  const [rows, setRows] = useState({
    trending: [], popular: [], topRated: [], nowPlaying: [], series: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (USE_MOCK) {
      setRows({
        trending: MOCK_MOVIES.slice(0, 8),
        popular: [...MOCK_MOVIES].reverse().slice(0, 8),
        topRated: MOCK_MOVIES.filter((_, i) => i % 2 === 0),
        nowPlaying: MOCK_MOVIES.filter((_, i) => i % 2 !== 0),
        series: MOCK_SERIES,
      });
      setLoading(false);
      return;
    }

    Promise.all([fetchTrending(), fetchPopular(), fetchTopRated(), fetchNowPlaying()])
      .then(([trending, popular, topRated, nowPlaying]) => {
        setRows({ trending, popular, topRated, nowPlaying, series: [] });
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { rows, loading, error };
}
