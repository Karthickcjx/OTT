import api from './api';

/**
 * Watchlist service — communicates with Spring Boot /watchlist endpoints.
 */

/** GET /watchlist — fetch user's watchlist */
export const fetchWatchlist = async () => {
  const { data } = await api.get('/watchlist');
  return data;
};

/**
 * POST /watchlist — add item to watchlist
 * @param {{ contentId: number, contentType: 'movie' | 'series' }} payload
 */
export const addToWatchlist = async (contentId, contentType = 'movie') => {
  const { data } = await api.post('/watchlist', { contentId, contentType: contentType.toUpperCase() });
  return data;
};

/**
 * DELETE /watchlist/:id — remove item from watchlist
 * @param {number} watchlistItemId
 */
export const removeFromWatchlist = async (watchlistItemId) => {
  const { data } = await api.delete(`/watchlist/${watchlistItemId}`);
  return data;
};
