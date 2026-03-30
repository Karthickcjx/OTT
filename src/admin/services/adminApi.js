import axios from 'axios';
import api from '../../services/api';

/**
 * Request a pre-signed S3 upload URL.
 * Backend: POST /api/upload-url
 * Returns: { uploadUrl: string, fileUrl: string }
 */
export const getPresignedUrl = (fileName, fileType) =>
  api.post('/api/upload-url', { fileName, fileType }).then((r) => r.data);

/**
 * Upload file directly to S3 via pre-signed PUT URL.
 * Uses bare axios so no auth headers are injected.
 */
export const uploadToS3 = (presignedUrl, file, onProgress) =>
  axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });

/* ─── Movie CRUD ──────────────────────────────────────────────── */

export const createMovie = (payload) =>
  api.post('/api/movies', { ...payload, type: 'movie' }).then((r) => r.data);

export const fetchAdminMovies = () =>
  api.get('/api/movies').then((r) => r.data);

export const updateMovie = (id, payload) =>
  api.put(`/api/movies/${id}`, payload).then((r) => r.data);

export const deleteMovie = (id) =>
  api.delete(`/api/movies/${id}`).then((r) => r.data);

/* ─── Series CRUD ─────────────────────────────────────────────── */

/**
 * Create a full series with seasons and episodes in one call.
 * Backend: POST /api/series
 * Payload shape:
 *   { title, description, genre, releaseYear, thumbnailUrl, bannerUrl,
 *     rating, status, seasons: [{ seasonNumber, episodes: [...] }] }
 */
export const createSeries = (payload) =>
  api.post('/api/series', { ...payload, type: 'series' }).then((r) => r.data);

export const fetchAdminSeries = () =>
  api.get('/api/series').then((r) => r.data);

export const updateSeries = (id, payload) =>
  api.put(`/api/series/${id}`, payload).then((r) => r.data);

export const deleteSeries = (id) =>
  api.delete(`/api/series/${id}`).then((r) => r.data);

/* ─── Unified content ─────────────────────────────────────────── */

export const fetchAllContent = () =>
  Promise.all([fetchAdminMovies(), fetchAdminSeries()]).then(([movies, series]) => [
    ...movies,
    ...series,
  ]);

/* ─── Dashboard stats ─────────────────────────────────────────── */

export const fetchDashboardStats = () =>
  api.get('/api/admin/stats').then((r) => r.data);

/* ─── Users ───────────────────────────────────────────────────── */

export const fetchUsers = () =>
  api.get('/api/admin/users').then((r) => r.data);

export const deleteUser = (id) =>
  api.delete(`/api/admin/users/${id}`).then((r) => r.data);
