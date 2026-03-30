import { Layers3, Plus, Trash2 } from 'lucide-react';
import { EmptyState, SectionHeader } from './AdminPrimitives';
import { cx } from '../utils/cx';

export default function SeriesStepSeasons({
  seasons,
  activeSeasonKey,
  onSelect,
  onAdd,
  onRemove,
}) {
  const totalEpisodes = seasons.reduce((sum, season) => sum + season.episodes.length, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Layers3}
        eyebrow="Step 2"
        title="Shape the season structure"
        description="Define each season block now, then we will attach episode media in the next step."
        action={(
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_46px_-24px_rgba(59,130,246,0.95)] transition-all duration-300 ease-in-out hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add Season
          </button>
        )}
      />

      {seasons.length === 0 ? (
        <EmptyState
          icon={Layers3}
          title="No seasons yet"
          description="Create the first season to continue building the series timeline."
          action={(
            <button
              type="button"
              onClick={onAdd}
              className="rounded-full border border-sky-300/20 bg-sky-400/12 px-4 py-2 text-sm font-semibold text-sky-100 transition-all duration-300 ease-in-out hover:border-sky-300/30 hover:bg-sky-400/18"
            >
              Add Season
            </button>
          )}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {seasons.map((season) => {
            const isActive = season._key === activeSeasonKey;
            const episodeCount = season.episodes.length;
            const uploadedCount = season.episodes.filter((episode) => episode.videoUrl).length;

            return (
              <button
                key={season._key}
                type="button"
                onClick={() => onSelect(season._key)}
                className={cx(
                  'group relative overflow-hidden rounded-[26px] border p-5 text-left transition-all duration-300 ease-in-out',
                  isActive
                    ? 'border-sky-300/25 bg-sky-400/12 shadow-[0_0_36px_-18px_rgba(56,189,248,0.95)]'
                    : 'border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.05]',
                )}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_52%,rgba(56,189,248,0.08))]" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Season block
                      </p>
                      <h3 className="admin-display mt-2 text-xl font-semibold text-white">
                        Season {season.seasonNumber}
                      </h3>
                    </div>

                    {seasons.length > 1 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onRemove(season._key);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-transparent text-slate-500 transition-all duration-300 ease-in-out hover:border-rose-300/20 hover:bg-rose-400/10 hover:text-rose-200"
                        aria-label={`Remove season ${season.seasonNumber}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">
                      <span className="text-sm text-slate-400">Episodes</span>
                      <span className="text-sm font-semibold text-white">{episodeCount}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3">
                      <span className="text-sm text-slate-400">Videos uploaded</span>
                      <span className={`text-sm font-semibold ${uploadedCount === episodeCount && episodeCount > 0 ? 'text-emerald-200' : 'text-amber-100'}`}>
                        {uploadedCount}/{episodeCount}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="mt-5 rounded-full border border-sky-300/20 bg-sky-400/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
                      Active season
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Season count', value: seasons.length },
          { label: 'Episode slots', value: totalEpisodes },
          { label: 'Current focus', value: seasons.find((season) => season._key === activeSeasonKey)?.seasonNumber ?? 1 },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
