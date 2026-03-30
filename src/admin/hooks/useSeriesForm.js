import { useState, useCallback } from 'react';

let keyCounter = 0;
const uid = () => `k_${++keyCounter}`;

function makeEpisode(episodeNumber = 1) {
  return { _key: uid(), episodeNumber, title: '', videoUrl: null, duration: '' };
}

function makeSeason(seasonNumber = 1) {
  return { _key: uid(), seasonNumber, episodes: [makeEpisode(1)] };
}

const INITIAL_INFO = {
  title: '', description: '', genre: '', releaseYear: String(new Date().getFullYear()),
  rating: '', status: 'published',
};

/**
 * Manages all state for the multi-step series upload form.
 *
 * Steps:  0 = Series Info,  1 = Seasons,  2 = Episodes
 */
export function useSeriesForm() {
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState(INITIAL_INFO);
  const [infoErrors, setInfoErrors] = useState({});
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [seasons, setSeasons] = useState([makeSeason(1)]);
  const [activeSeasonKey, setActiveSeasonKey] = useState(seasons[0]._key);

  /* ── Info helpers ─────────────────────────────────────────── */
  const setInfoField = useCallback((field, value) => {
    setInfo((f) => ({ ...f, [field]: value }));
    setInfoErrors((e) => ({ ...e, [field]: undefined }));
  }, []);

  const validateInfo = useCallback(() => {
    const errs = {};
    if (!info.title.trim()) errs.title = 'Title is required';
    if (!info.description.trim()) errs.description = 'Description is required';
    if (!info.genre) errs.genre = 'Select a genre';
    if (!info.releaseYear || isNaN(info.releaseYear)) errs.releaseYear = 'Enter a valid year';
    if (!thumbnailUrl) errs.thumbnail = 'Upload a thumbnail';
    setInfoErrors(errs);
    return Object.keys(errs).length === 0;
  }, [info, thumbnailUrl]);

  /* ── Season helpers ───────────────────────────────────────── */
  const addSeason = useCallback(() => {
    setSeasons((prev) => {
      const next = makeSeason(prev.length + 1);
      setActiveSeasonKey(next._key);
      return [...prev, next];
    });
  }, []);

  const removeSeason = useCallback((key) => {
    setSeasons((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((s) => s._key !== key);
      if (key === activeSeasonKey) setActiveSeasonKey(next[next.length - 1]._key);
      return next.map((s, i) => ({ ...s, seasonNumber: i + 1 }));
    });
  }, [activeSeasonKey]);

  /* ── Episode helpers ─────────────────────────────────────── */
  const addEpisode = useCallback((seasonKey) => {
    setSeasons((prev) =>
      prev.map((s) => {
        if (s._key !== seasonKey) return s;
        return { ...s, episodes: [...s.episodes, makeEpisode(s.episodes.length + 1)] };
      })
    );
  }, []);

  const removeEpisode = useCallback((seasonKey, episodeKey) => {
    setSeasons((prev) =>
      prev.map((s) => {
        if (s._key !== seasonKey) return s;
        const eps = s.episodes
          .filter((e) => e._key !== episodeKey)
          .map((e, i) => ({ ...e, episodeNumber: i + 1 }));
        return { ...s, episodes: eps };
      })
    );
  }, []);

  const updateEpisode = useCallback((seasonKey, episodeKey, field, value) => {
    setSeasons((prev) =>
      prev.map((s) => {
        if (s._key !== seasonKey) return s;
        return {
          ...s,
          episodes: s.episodes.map((e) =>
            e._key === episodeKey ? { ...e, [field]: value } : e
          ),
        };
      })
    );
  }, []);

  const setEpisodeVideoUrl = useCallback((seasonKey, episodeKey, url) => {
    updateEpisode(seasonKey, episodeKey, 'videoUrl', url);
  }, [updateEpisode]);

  /* ── Navigation ──────────────────────────────────────────── */
  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, 2)), []);
  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const goToStep = useCallback((s) => setStep(s), []);

  /* ── Build payload ───────────────────────────────────────── */
  const buildPayload = useCallback(() => ({
    type: 'series',
    title: info.title.trim(),
    description: info.description.trim(),
    genre: info.genre,
    releaseYear: Number(info.releaseYear),
    rating: info.rating ? Number(info.rating) : null,
    status: info.status,
    thumbnailUrl,
    bannerUrl,
    seasons: seasons.map((s) => ({
      seasonNumber: s.seasonNumber,
      episodes: s.episodes.map((e) => ({
        episodeNumber: e.episodeNumber,
        title: e.title.trim(),
        videoUrl: e.videoUrl,
        duration: Number(e.duration) || 0,
      })),
    })),
  }), [info, thumbnailUrl, bannerUrl, seasons]);

  /* ── Reset ───────────────────────────────────────────────── */
  const reset = useCallback(() => {
    setStep(0);
    setInfo(INITIAL_INFO);
    setInfoErrors({});
    setThumbnailUrl(null);
    setBannerUrl(null);
    const first = makeSeason(1);
    setSeasons([first]);
    setActiveSeasonKey(first._key);
  }, []);

  return {
    step, goNext, goBack, goToStep,
    info, setInfoField, infoErrors, setInfoErrors, validateInfo,
    thumbnailUrl, setThumbnailUrl,
    bannerUrl, setBannerUrl,
    seasons, activeSeasonKey, setActiveSeasonKey,
    addSeason, removeSeason,
    addEpisode, removeEpisode, updateEpisode, setEpisodeVideoUrl,
    buildPayload, reset,
  };
}
