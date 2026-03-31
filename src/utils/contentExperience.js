const KIDS_GENRES = new Set(['Animation', 'Adventure', 'Comedy', 'Fantasy', 'Family']);
const BLOCKED_KIDS_GENRES = new Set(['Horror', 'Crime', 'Thriller']);

export function getContentType(item) {
  return item?.type === 'series' || item?.seasons ? 'series' : 'movie';
}

export function getGenreNames(item) {
  if (!item) return [];

  if (Array.isArray(item.genres) && item.genres.length > 0) {
    return item.genres.map((genre) => genre.name || genre).filter(Boolean);
  }

  if (item.genre) return [item.genre];
  return [];
}

export function normalizeContent(item) {
  return {
    ...item,
    type: getContentType(item),
  };
}

export function uniqueContent(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function isKidsContent(item) {
  const genres = getGenreNames(item);

  if (genres.some((genre) => BLOCKED_KIDS_GENRES.has(genre))) {
    return false;
  }

  if (genres.some((genre) => KIDS_GENRES.has(genre))) {
    return true;
  }

  return false;
}

export function filterContentForProfile(items = [], profile) {
  const normalized = uniqueContent(items.map(normalizeContent));

  if (profile?.type !== 'kids') return normalized;
  return normalized.filter(isKidsContent);
}

export function getReleaseYear(item) {
  return String(item?.release_date || item?.releaseYear || '').slice(0, 4) || 'New';
}

export function getPrimaryGenre(item) {
  return getGenreNames(item)[0] || 'Featured';
}

export function getEpisodeCount(item) {
  if (!item?.seasons?.length) return 0;
  return item.seasons.reduce((total, season) => total + (season.episodes?.length || 0), 0);
}

export function getRuntimeLabel(item) {
  if (!item) return null;

  if (item.type === 'series' || item.seasons?.length) {
    const seasonCount = item.seasons?.length || 0;
    const episodeCount = getEpisodeCount(item);

    if (!seasonCount && !episodeCount) return null;
    if (!seasonCount) return `${episodeCount} episodes`;
    if (!episodeCount) return `${seasonCount} season${seasonCount === 1 ? '' : 's'}`;
    return `${seasonCount} season${seasonCount === 1 ? '' : 's'} | ${episodeCount} episodes`;
  }

  if (item.runtime) return `${item.runtime} min`;
  return null;
}

function sortByRating(items = []) {
  return [...items].sort((left, right) => (right.vote_average || 0) - (left.vote_average || 0));
}

function sortByRelease(items = []) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left.release_date || left.releaseYear || 0).getTime();
    const rightDate = new Date(right.release_date || right.releaseYear || 0).getTime();
    return rightDate - leftDate;
  });
}

export function buildShowcaseRows(rows, recentlyWatched, activeProfile, isAuthenticated = false) {
  const pool = {
    trending: filterContentForProfile(rows.trending, activeProfile),
    popular: filterContentForProfile(rows.popular, activeProfile),
    topRated: filterContentForProfile(rows.topRated, activeProfile),
    nowPlaying: filterContentForProfile(rows.nowPlaying, activeProfile),
    series: filterContentForProfile(rows.series, activeProfile),
    continueWatching: filterContentForProfile(recentlyWatched, activeProfile),
  };

  const topPicks = uniqueContent(sortByRating([
    ...pool.topRated,
    ...pool.popular,
    ...pool.series,
  ])).slice(0, 12);

  const kidsPool = uniqueContent(sortByRating([
    ...pool.trending,
    ...pool.popular,
    ...pool.series,
    ...pool.topRated,
    ...pool.nowPlaying,
  ])).filter(isKidsContent);

  const kidsLatest = uniqueContent(sortByRelease(kidsPool)).slice(0, 12);
  const familyNight = uniqueContent([
    ...pool.series.filter(isKidsContent),
    ...kidsPool,
  ]).slice(0, 12);
  const continueWatching = isAuthenticated ? pool.continueWatching.slice(0, 12) : [];

  if (activeProfile?.type === 'kids') {
    return [
      {
        key: 'continue-watching',
        title: 'Continue Watching',
        subtitle: 'Pick up right where your adventure paused.',
        items: continueWatching,
        variant: 'kids',
      },
      {
        key: 'kids-picks',
        title: 'Kids Picks',
        subtitle: 'Safe adventures and playful favorites for young viewers.',
        items: kidsPool.slice(0, 12),
        variant: 'kids',
      },
      {
        key: 'animated-adventures',
        title: 'Animated Adventures',
        subtitle: 'Bright worlds, family energy, and easy-to-love stories.',
        items: kidsLatest,
        variant: 'kids',
      },
      {
        key: 'family-night',
        title: 'Family Night',
        subtitle: 'Easy picks for shared watching time.',
        items: familyNight,
        variant: 'kids',
      },
    ].filter((row) => row.items.length > 0);
  }

  return [
    {
      key: 'trending',
      title: 'Trending Now',
      subtitle: 'The breakout titles everyone is talking about.',
      items: pool.trending,
      variant: 'default',
    },
    {
      key: 'continue-watching',
      title: 'Continue Watching',
      subtitle: 'Jump straight back into what you started.',
      items: pool.continueWatching,
      variant: 'default',
    },
    {
      key: 'top-picks',
      title: 'Top Picks',
      subtitle: 'A curated mix of fan favorites and critically loved titles.',
      items: topPicks,
      variant: 'default',
    },
    {
      key: 'new-releases',
      title: 'New Releases',
      subtitle: 'Fresh premieres and recent drops.',
      items: pool.nowPlaying,
      variant: 'default',
    },
    {
      key: 'binge-series',
      title: 'Binge-Worthy Series',
      subtitle: 'Serialized stories built for long nights.',
      items: pool.series,
      variant: 'default',
    },
  ].filter((row) => row.items.length > 0);
}

export function pickFeaturedContent(rows, activeProfile) {
  const showcaseRows = buildShowcaseRows(rows, [], activeProfile);
  return showcaseRows[0]?.items?.[0] || null;
}
