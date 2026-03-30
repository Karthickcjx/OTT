import { IMG_BASE } from '../services/tmdb';

const ADULT_PALETTES = [
  ['#0f172a', '#312e81', '#7c3aed'],
  ['#020617', '#4c1d95', '#e11d48'],
  ['#0b1120', '#1d4ed8', '#06b6d4'],
  ['#111827', '#4c1d95', '#f43f5e'],
  ['#030712', '#7e22ce', '#2563eb'],
];

const KIDS_PALETTES = [
  ['#0ea5e9', '#22c55e', '#facc15'],
  ['#6366f1', '#ec4899', '#f97316'],
  ['#14b8a6', '#60a5fa', '#f59e0b'],
  ['#10b981', '#38bdf8', '#fb7185'],
  ['#8b5cf6', '#22c55e', '#fbbf24'],
];

function hashString(value = '') {
  return Array.from(value).reduce((total, char, index) => {
    return total + char.charCodeAt(0) * (index + 1);
  }, 0);
}

function getPalette(seed, kidsMode = false) {
  const palettes = kidsMode ? KIDS_PALETTES : ADULT_PALETTES;
  return palettes[seed % palettes.length];
}

function toDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function splitTitle(title = '', maxLineLength = 18) {
  const words = title.split(' ').filter(Boolean);
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLineLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function getGenreLabel(item) {
  const genre = item.genres?.[0]?.name || item.genre || item.type || 'Featured';
  return String(genre).toUpperCase();
}

function getContentType(item) {
  return item.type === 'series' || item.seasons ? 'SERIES' : 'MOVIE';
}

export function getProfileAvatar(profile) {
  const seed = hashString(`${profile.id}-${profile.name}-${profile.type}`);
  const [start, mid, end] = getPalette(seed, profile.type === 'kids');
  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'SV';

  const badge = profile.type === 'kids' ? 'KIDS' : 'PRO';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="52%" stop-color="${mid}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="72" fill="url(#g)" />
      <circle cx="188" cy="54" r="24" fill="rgba(255,255,255,0.18)" />
      <circle cx="62" cy="182" r="30" fill="rgba(255,255,255,0.12)" />
      <rect x="24" y="22" width="64" height="28" rx="14" fill="rgba(2,6,23,0.24)" />
      <text x="56" y="40" text-anchor="middle" font-family="Sora, Arial, sans-serif" font-size="13" font-weight="700" fill="rgba(255,255,255,0.88)">${badge}</text>
      <text x="120" y="136" text-anchor="middle" font-family="Sora, Arial, sans-serif" font-size="72" font-weight="800" fill="rgba(255,255,255,0.92)">${initials}</text>
    </svg>
  `;

  return toDataUri(svg);
}

function buildPosterSvg(item, kidsMode = false) {
  const seed = hashString(`${item.id}-${item.title}-${item.release_date || item.releaseYear || ''}`);
  const [start, mid, end] = getPalette(seed, kidsMode);
  const titleLines = splitTitle(item.title, kidsMode ? 14 : 16);
  const genreLabel = getGenreLabel(item);
  const typeLabel = getContentType(item);

  const titleMarkup = titleLines
    .map((line, index) => `<text x="44" y="${620 + index * 56}" font-family="Sora, Arial, sans-serif" font-size="${kidsMode ? 44 : 40}" font-weight="700" fill="white">${line}</text>`)
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="720" height="1080" viewBox="0 0 720 1080">
      <defs>
        <linearGradient id="posterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="45%" stop-color="${mid}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="720" height="1080" rx="52" fill="url(#posterGradient)" />
      <rect width="720" height="1080" rx="52" fill="rgba(15,23,42,0.2)" />
      <circle cx="582" cy="168" r="130" fill="rgba(255,255,255,0.12)" />
      <circle cx="134" cy="224" r="84" fill="rgba(255,255,255,0.08)" />
      <rect x="44" y="50" width="168" height="42" rx="21" fill="rgba(2,6,23,0.34)" />
      <text x="128" y="78" text-anchor="middle" font-family="Sora, Arial, sans-serif" font-size="20" font-weight="700" fill="rgba(255,255,255,0.9)">${typeLabel}</text>
      <text x="44" y="594" font-family="Manrope, Arial, sans-serif" font-size="22" font-weight="700" fill="rgba(255,255,255,0.72)" letter-spacing="4">${genreLabel}</text>
      ${titleMarkup}
      <rect x="44" y="916" width="220" height="56" rx="28" fill="rgba(2,6,23,0.34)" />
      <text x="154" y="952" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="26" font-weight="700" fill="rgba(255,255,255,0.92)">STREAMVAULT</text>
    </svg>
  `;

  return toDataUri(svg);
}

function buildBackdropSvg(item, kidsMode = false) {
  const seed = hashString(`${item.id}-${item.title}-${item.release_date || item.releaseYear || ''}-backdrop`);
  const [start, mid, end] = getPalette(seed, kidsMode);
  const titleLines = splitTitle(item.title, kidsMode ? 20 : 22);
  const genreLabel = getGenreLabel(item);
  const typeLabel = getContentType(item);

  const titleMarkup = titleLines
    .map((line, index) => `<text x="112" y="${360 + index * 74}" font-family="Sora, Arial, sans-serif" font-size="${kidsMode ? 60 : 72}" font-weight="800" fill="white">${line}</text>`)
    .join('');

  const accentShape = kidsMode
    ? '<circle cx="1370" cy="170" r="170" fill="rgba(255,255,255,0.16)" /><circle cx="1500" cy="330" r="84" fill="rgba(255,255,255,0.12)" />'
    : '<circle cx="1380" cy="190" r="180" fill="rgba(255,255,255,0.14)" /><rect x="1180" y="420" width="260" height="260" rx="72" fill="rgba(255,255,255,0.08)" />';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="backdropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="48%" stop-color="${mid}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#backdropGradient)" />
      <rect width="1600" height="900" fill="rgba(2,6,23,0.22)" />
      <ellipse cx="1220" cy="170" rx="340" ry="210" fill="rgba(255,255,255,0.08)" />
      <ellipse cx="220" cy="220" rx="180" ry="130" fill="rgba(255,255,255,0.08)" />
      ${accentShape}
      <rect x="112" y="120" width="188" height="44" rx="22" fill="rgba(2,6,23,0.34)" />
      <text x="206" y="149" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="21" font-weight="700" fill="rgba(255,255,255,0.92)">${typeLabel}</text>
      <text x="112" y="284" font-family="Manrope, Arial, sans-serif" font-size="24" font-weight="700" fill="rgba(255,255,255,0.72)" letter-spacing="5">${genreLabel}</text>
      ${titleMarkup}
      <text x="112" y="658" font-family="Manrope, Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.82)">PREMIUM STREAMING PREMIERE</text>
    </svg>
  `;

  return toDataUri(svg);
}

export function getPosterArtwork(item, kidsMode = false) {
  if (item?.poster_path) return `${IMG_BASE}/w500${item.poster_path}`;
  return buildPosterSvg(item, kidsMode);
}

export function getBackdropArtwork(item, kidsMode = false) {
  if (item?.backdrop_path) return `${IMG_BASE}/original${item.backdrop_path}`;
  return buildBackdropSvg(item, kidsMode);
}
