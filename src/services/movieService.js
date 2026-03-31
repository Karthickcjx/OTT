import api from './api';

/**
 * Movie + Series service — communicates with Spring Boot endpoints.
 */

/* ─── Movies ──────────────────────────────────────────────────── */

/** GET /movies — list all movies */
export const fetchMovies = async () => {
  const { data } = await api.get('/movies');
  return data;
};

/** GET /movies/:id — single movie with full details */
export const fetchMovieById = async (id) => {
  const { data } = await api.get(`/movies/${id}`);
  return data;
};

/* ─── Series ──────────────────────────────────────────────────── */

/** GET /series — list all series */
export const fetchSeries = async () => {
  const { data } = await api.get('/series');
  return data;
};

/** GET /series/:id — single series with seasons + episodes */
export const fetchSeriesById = async (id) => {
  const { data } = await api.get(`/series/${id}`);
  return data;
};

/* ─── Search ──────────────────────────────────────────────────── */

/** GET /search?q=... — unified search across movies and series */
export const searchContent = async (query) => {
  const { data } = await api.get('/search', { params: { q: query } });
  return data;
};

/* ─── Helpers ─────────────────────────────────────────────────── */

/**
 * Fetch both movies and series in parallel for the home page.
 * Returns { movies: [], series: [] }
 */
export const fetchHomeData = async () => {
  const [movies, series] = await Promise.all([fetchMovies(), fetchSeries()]);
  return { movies, series };
};
