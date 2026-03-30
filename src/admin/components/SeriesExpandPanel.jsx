import { useState } from 'react';
import { CheckCircle2, ChevronRight, CircleDashed } from 'lucide-react';
import { EmptyState } from './AdminPrimitives';
import { cx } from '../utils/cx';

function EpisodeRow({ episode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-slate-950/55 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white">
        {episode.episodeNumber}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-white">
          {episode.title || `Episode ${episode.episodeNumber}`}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {episode.duration ? `${episode.duration} min` : 'Duration pending'}
        </p>
      </div>
      <span
        className={cx(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
          episode.videoUrl
            ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200'
            : 'border-amber-300/20 bg-amber-400/12 text-amber-100',
        )}
      >
        {episode.videoUrl ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
        {episode.videoUrl ? 'Uploaded' : 'Pending'}
      </span>
    </div>
  );
}

export default function SeriesExpandPanel({ series }) {
  const [openSeason, setOpenSeason] = useState(null);

  if (!series.seasons?.length) {
    return (
      <div className="p-5">
        <EmptyState
          icon={CircleDashed}
          title="No seasons added yet"
          description="This series has not been structured with seasons or episodes."
          className="py-10"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 p-5">
      {series.seasons.map((season) => {
        const isOpen = openSeason === season.seasonNumber;
        const uploadedCount = season.episodes.filter((episode) => episode.videoUrl).length;

        return (
          <div
            key={season.seasonNumber}
            className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]"
          >
            <button
              type="button"
              onClick={() => setOpenSeason(isOpen ? null : season.seasonNumber)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-all duration-300 ease-in-out hover:bg-white/[0.03]"
            >
              <span className={cx(
                'flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition-transform duration-300 ease-in-out',
                isOpen ? 'rotate-90' : '',
              )}>
                <ChevronRight className="h-4 w-4" />
              </span>

              <div>
                <p className="text-sm font-semibold text-white">Season {season.seasonNumber}</p>
                <p className="mt-1 text-xs text-slate-500">{season.episodes.length} episodes</p>
              </div>

              <span className={`ml-auto rounded-full border px-3 py-1 text-xs font-semibold ${
                uploadedCount === season.episodes.length
                  ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200'
                  : 'border-amber-300/20 bg-amber-400/12 text-amber-100'
              }`}>
                {uploadedCount}/{season.episodes.length} uploaded
              </span>
            </button>

            {isOpen && (
              <div className="space-y-3 border-t border-white/8 p-5">
                {season.episodes.map((episode) => (
                  <EpisodeRow key={episode.episodeNumber} episode={episode} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
