import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const fetchTrending = () =>
  tmdb.get('/trending/movie/week').then((r) => r.data.results);

export const fetchPopular = () =>
  tmdb.get('/movie/popular').then((r) => r.data.results);

export const fetchTopRated = () =>
  tmdb.get('/movie/top_rated').then((r) => r.data.results);

export const fetchNowPlaying = () =>
  tmdb.get('/movie/now_playing').then((r) => r.data.results);

export const fetchMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } }).then((r) => r.data);

export const fetchSimilar = (id) =>
  tmdb.get(`/movie/${id}/similar`).then((r) => r.data.results);

export const searchMovies = (query) =>
  tmdb.get('/search/movie', { params: { query } }).then((r) => r.data.results);

export const fetchGenres = () =>
  tmdb.get('/genre/movie/list').then((r) => r.data.genres);

export default tmdb;
