export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller', 'Western',
];

export const MOCK_ADMIN_MOVIES = [
  {
    id: 101, type: 'movie',
    title: 'Galactic Odyssey',
    genre: 'Science Fiction', releaseYear: 2024, duration: 142, rating: 8.4,
    thumbnailUrl: null, bannerUrl: null,
    videoUrl: 'https://example.com/videos/galactic-odyssey.mp4',
    views: 184320, status: 'published', createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 102, type: 'movie',
    title: 'Shadow Protocol',
    genre: 'Thriller', releaseYear: 2024, duration: 118, rating: 7.9,
    thumbnailUrl: null, bannerUrl: null,
    videoUrl: 'https://example.com/videos/shadow-protocol.mp4',
    views: 97450, status: 'published', createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 103, type: 'movie',
    title: 'Ember Falls',
    genre: 'Romance', releaseYear: 2024, duration: 105, rating: 7.2,
    thumbnailUrl: null, bannerUrl: null,
    videoUrl: 'https://example.com/videos/ember-falls.mp4',
    views: 54210, status: 'published', createdAt: '2024-02-14T10:00:00Z',
  },
  {
    id: 104, type: 'movie',
    title: 'Iron Vanguard',
    genre: 'Action', releaseYear: 2024, duration: 156, rating: 8.1,
    thumbnailUrl: null, bannerUrl: null,
    videoUrl: 'https://example.com/videos/iron-vanguard.mp4',
    views: 231870, status: 'published', createdAt: '2024-05-01T10:00:00Z',
  },
  {
    id: 105, type: 'movie',
    title: 'Neon District',
    genre: 'Science Fiction', releaseYear: 2024, duration: 131, rating: 8.0,
    thumbnailUrl: null, bannerUrl: null, videoUrl: null,
    views: 0, status: 'draft', createdAt: '2024-06-22T10:00:00Z',
  },
];

export const MOCK_ADMIN_SERIES = [
  {
    id: 201, type: 'series',
    title: 'Quantum Nexus',
    genre: 'Science Fiction', releaseYear: 2023, rating: 8.7,
    thumbnailUrl: null, bannerUrl: null,
    views: 892340, status: 'published', createdAt: '2023-09-10T10:00:00Z',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episodeNumber: 1, title: 'Awakening', videoUrl: 'https://example.com/qn-s1e1.mp4', duration: 52 },
          { episodeNumber: 2, title: 'The Signal', videoUrl: 'https://example.com/qn-s1e2.mp4', duration: 48 },
          { episodeNumber: 3, title: 'Fracture Point', videoUrl: 'https://example.com/qn-s1e3.mp4', duration: 55 },
          { episodeNumber: 4, title: 'Dark Meridian', videoUrl: 'https://example.com/qn-s1e4.mp4', duration: 51 },
        ],
      },
      {
        seasonNumber: 2,
        episodes: [
          { episodeNumber: 1, title: 'New Horizons', videoUrl: 'https://example.com/qn-s2e1.mp4', duration: 54 },
          { episodeNumber: 2, title: 'The Collapse', videoUrl: 'https://example.com/qn-s2e2.mp4', duration: 49 },
          { episodeNumber: 3, title: 'Void Walker', videoUrl: 'https://example.com/qn-s2e3.mp4', duration: 58 },
        ],
      },
    ],
  },
  {
    id: 202, type: 'series',
    title: 'Crimson House',
    genre: 'Drama', releaseYear: 2024, rating: 8.3,
    thumbnailUrl: null, bannerUrl: null,
    views: 341200, status: 'published', createdAt: '2024-03-01T10:00:00Z',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episodeNumber: 1, title: 'The Arrival', videoUrl: 'https://example.com/ch-s1e1.mp4', duration: 45 },
          { episodeNumber: 2, title: 'Old Wounds', videoUrl: 'https://example.com/ch-s1e2.mp4', duration: 43 },
          { episodeNumber: 3, title: 'Buried Truth', videoUrl: 'https://example.com/ch-s1e3.mp4', duration: 47 },
          { episodeNumber: 4, title: 'The Letter', videoUrl: 'https://example.com/ch-s1e4.mp4', duration: 44 },
          { episodeNumber: 5, title: 'Fire Season', videoUrl: 'https://example.com/ch-s1e5.mp4', duration: 50 },
        ],
      },
    ],
  },
  {
    id: 203, type: 'series',
    title: 'Zero Meridian',
    genre: 'Thriller', releaseYear: 2024, rating: 7.8,
    thumbnailUrl: null, bannerUrl: null, videoUrl: null,
    views: 0, status: 'draft', createdAt: '2024-07-15T10:00:00Z',
    seasons: [],
  },
];

export const MOCK_STATS = {
  totalMovies: 5,
  totalSeries: 3,
  totalUsers: 1284,
  totalViews: 1570220,
  storageUsedGB: 314.7,
};

export const MOCK_USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'user', joinedAt: '2024-01-10', watchlistCount: 12 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', joinedAt: '2024-02-22', watchlistCount: 4 },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user', joinedAt: '2024-03-05', watchlistCount: 31 },
  { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: 'admin', joinedAt: '2023-12-01', watchlistCount: 0 },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'user', joinedAt: '2024-04-18', watchlistCount: 8 },
];
