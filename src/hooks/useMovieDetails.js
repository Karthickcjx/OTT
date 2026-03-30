import { useState, useEffect } from 'react';
import { fetchMovieDetails, fetchSimilar } from '../services/tmdb';
import { MOCK_MOVIES } from '../services/mockData';

const USE_MOCK = !import.meta.env.VITE_TMDB_API_KEY;

export function useMovieDetails(id) {
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    if (USE_MOCK) {
      const found = MOCK_MOVIES.find((m) => m.id === Number(id));
      setMovie(found || MOCK_MOVIES[0]);
      setSimilar(MOCK_MOVIES.filter((m) => m.id !== Number(id)).slice(0, 6));
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([fetchMovieDetails(id), fetchSimilar(id)])
      .then(([details, sim]) => {
        setMovie(details);
        setSimilar(sim.slice(0, 12));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { movie, similar, loading, error };
}
