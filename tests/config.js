/**
 * Shared test configuration.
 * All API tests point directly at the Spring Boot backend.
 */

export const BASE_URL = 'http://localhost:8080/api';
export const FRONTEND_URL = 'http://localhost:5173';
export const TIMEOUT_MS = 12_000;

// Seeded by DataSeeder on every backend start
export const ADMIN_CREDS = {
  email: 'admin@streamvault.com',
  password: 'admin123',
};

// Dynamically suffixed so parallel runs don't collide
const uid = Date.now();
export const USER_CREDS = {
  name: 'QA Test User',
  email: `qa_user_${uid}@test.local`,
  password: 'QaPass@9876',
};

// Payload used for movie create / update tests
export const MOVIE_FIXTURE = {
  title: `QA Movie ${uid}`,
  description: 'Automated test movie created by the QA suite.',
  genre: 'Science Fiction',
  releaseYear: 2025,
  rating: 7.5,
  thumbnailUrl: 'https://placehold.co/300x450/1e293b/fff?text=QA+Movie',
  bannerUrl: 'https://placehold.co/1280x720/1e293b/fff?text=QA+Movie',
  videoUrl: 'https://example.com/qa-movie.mp4',
  status: 'published',
  type: 'movie',
};

// Payload used for series create tests
export const SERIES_FIXTURE = {
  title: `QA Series ${uid}`,
  description: 'Automated test series created by the QA suite.',
  genre: 'Drama',
  releaseYear: 2025,
  rating: 8.1,
  thumbnailUrl: 'https://placehold.co/300x450/1e293b/fff?text=QA+Series',
  bannerUrl: 'https://placehold.co/1280x720/1e293b/fff?text=QA+Series',
  status: 'published',
  type: 'series',
  seasons: [
    {
      seasonNumber: 1,
      episodes: [
        { episodeNumber: 1, title: 'Pilot', videoUrl: 'https://example.com/s1e1.mp4', duration: 45 },
        { episodeNumber: 2, title: 'Rise', videoUrl: 'https://example.com/s1e2.mp4', duration: 42 },
      ],
    },
  ],
};
