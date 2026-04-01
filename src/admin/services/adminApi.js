import axios from 'axios';
import api from '../../services/api';

/**
 * Upload file directly to backend API.
 * Backend: POST /api/upload
 * Returns: { fileUrl: string }
 */
export const uploadFile = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0, // no timeout — video uploads can take several minutes
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  }).then((r) => r.data);
};

/* ─── Movie CRUD ──────────────────────────────────────────────── */

export const createMovie = (payload) =>
  api.post('/movies', { ...payload, type: 'movie' }).then((r) => r.data);

export const fetchAdminMovies = () =>
  api.get('/movies').then((r) => r.data);

export const updateMovie = (id, payload) =>
  api.put(`/movies/${id}`, payload).then((r) => r.data);

export const deleteMovie = (id) =>
  api.delete(`/movies/${id}`).then((r) => r.data);

/* ─── Series CRUD ─────────────────────────────────────────────── */

/**
 * Create a full series with seasons and episodes in one call.
 * Backend: POST /api/series
 * Payload shape:
 *   { title, description, genre, releaseYear, thumbnailUrl, bannerUrl,
 *     rating, status, seasons: [{ seasonNumber, episodes: [...] }] }
 */
export const createSeries = (payload) =>
  api.post('/series', { ...payload, type: 'series' }).then((r) => r.data);

export const fetchAdminSeries = () =>
  api.get('/series').then((r) => r.data);

export const updateSeries = (id, payload) =>
  api.put(`/series/${id}`, payload).then((r) => r.data);

export const deleteSeries = (id) =>
  api.delete(`/series/${id}`).then((r) => r.data);

/* ─── Unified content ─────────────────────────────────────────── */

export const fetchAllContent = () =>
  Promise.all([fetchAdminMovies(), fetchAdminSeries()]).then(([movies, series]) => [
    ...movies,
    ...series,
  ]);

/* ─── Dashboard stats ─────────────────────────────────────────── */

export const fetchDashboardStats = () =>
  api.get('/admin/stats').then((r) => r.data);

/* ─── Users ───────────────────────────────────────────────────── */

export const fetchUsers = () =>
  api.get('/users').then((r) => r.data);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`).then((r) => r.data);
