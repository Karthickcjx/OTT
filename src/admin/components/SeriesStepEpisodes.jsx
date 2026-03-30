import { Clapperboard, Plus } from 'lucide-react';
import EpisodeUploadRow from './EpisodeUploadRow';
import { EmptyState, SectionHeader } from './AdminPrimitives';
import { cx } from '../utils/cx';

export default function SeriesStepEpisodes({
  seasons,
  activeSeasonKey,
  onSelectSeason,
  onAddEpisode,
  onRemoveEpisode,
  onUpdateEpisode,
  onVideoUploaded,
}) {
  const activeSeason = seasons.find((season) => season._key === activeSeasonKey) ?? seasons[0];

  if (!activeSeason) {
    return (
      <EmptyState
        icon={Clapperboard}
        title="No seasons available"
        description="Go back one step and add at least one season before attaching episode files."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Clapperboard}
        eyebrow="Step 3"
        title="Deliver episode media"
        description="Upload episode videos season by season with collapsible production cards."
      />

      <div className="flex flex-wrap items-center gap-2">
        {seasons.map((season) => {
          const uploadedCount = season.episodes.filter((episode) => episode.videoUrl).length;
          const isActive = season._key === activeSeason._key;

          return (
            <button
              key={season._key}
              type="button"
              onClick={() => onSelectSeason(season._key)}
              className={cx(
                'inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out',
                isActive
                  ? 'border-sky-300/25 bg-sky-400/12 text-white shadow-[0_0_28px_-16px_rgba(56,189,248,0.95)]'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/15 hover:bg-white/[0.05] hover:text-white',
              )}
            >
              Season {season.seasonNumber}
              <span
                className={cx(
                  'rounded-full border px-2.5 py-1 text-xs',
                  uploadedCount === season.episodes.length && season.episodes.length > 0
                    ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200'
                    : 'border-white/10 bg-slate-950/60 text-slate-400',
                )}
              >
                {uploadedCount}/{season.episodes.length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {activeSeason.episodes.map((episode) => (
          <EpisodeUploadRow
            key={episode._key}
            episode={episode}
            seasonKey={activeSeason._key}
            onUpdate={onUpdateEpisode}
            onRemove={onRemoveEpisode}
            onVideoUploaded={onVideoUploaded}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAddEpisode(activeSeason._key)}
        className="flex w-full items-center justify-center gap-3 rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
          <Plus className="h-4 w-4" />
        </span>
        Add Episode to Season {activeSeason.seasonNumber}
      </button>

      <div className="grid gap-4 md:grid-cols-3">
        {seasons.map((season) => {
          const uploadedCount = season.episodes.filter((episode) => episode.videoUrl).length;
          const completion = season.episodes.length > 0
            ? Math.round((uploadedCount / season.episodes.length) * 100)
            : 0;

          return (
            <div key={season._key} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Season {season.seasonNumber}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {uploadedCount}/{season.episodes.length} uploaded
                  </p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  completion === 100
                    ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200'
                    : 'border-amber-300/20 bg-amber-400/12 text-amber-100'
                }`}>
                  {completion}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
