import { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Film,
  RefreshCw,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { useS3Upload } from '../hooks/useS3Upload';
import { cx } from '../utils/cx';

function MiniProgressBar({ progress }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-violet-400 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

const inputClassName = 'w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out placeholder:text-slate-600 focus:border-sky-400/45 focus:shadow-[0_0_28px_-16px_rgba(56,189,248,0.95)]';

export default function EpisodeUploadRow({
  episode,
  seasonKey,
  onUpdate,
  onRemove,
  onVideoUploaded,
}) {
  const s3 = useS3Upload();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (s3.url) onVideoUploaded(seasonKey, episode._key, s3.url);
  }, [episode._key, onVideoUploaded, s3.url, seasonKey]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    await s3.upload(file);
  };

  const hasVideo = Boolean(episode.videoUrl);

  return (
    <div className="admin-card overflow-hidden border border-white/10 bg-white/[0.04]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%,rgba(56,189,248,0.06))]" />

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="relative flex w-full items-center gap-4 px-5 py-4 text-left transition-all duration-300 ease-in-out hover:bg-white/[0.03]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-base font-semibold text-white">
          {episode.episodeNumber}
        </div>

        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold text-white">
            {episode.title || `Episode ${episode.episodeNumber}`}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {episode.duration ? `${episode.duration} min` : 'Duration pending'}
            </span>
            <span
              className={cx(
                'rounded-full border px-2.5 py-1 font-semibold',
                hasVideo
                  ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200'
                  : 'border-amber-300/20 bg-amber-400/10 text-amber-100',
              )}
            >
              {hasVideo ? 'Video uploaded' : 'Awaiting video'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(seasonKey, episode._key);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-transparent text-slate-500 transition-all duration-300 ease-in-out hover:border-rose-300/20 hover:bg-rose-400/10 hover:text-rose-200"
            aria-label={`Remove episode ${episode.episodeNumber}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="relative border-t border-white/8 px-5 py-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.45fr_0.95fr]">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Episode title
              </label>
              <input
                type="text"
                value={episode.title}
                onChange={(event) => onUpdate(seasonKey, episode._key, 'title', event.target.value)}
                placeholder={`Episode ${episode.episodeNumber} title`}
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Duration
              </label>
              <input
                type="number"
                min="1"
                value={episode.duration}
                onChange={(event) => onUpdate(seasonKey, episode._key, 'duration', event.target.value)}
                placeholder="Minutes"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Video file
              </label>

              {hasVideo && !s3.uploading ? (
                <div className="rounded-[22px] border border-emerald-300/18 bg-emerald-400/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/15 text-emerald-100">
                        <Film className="h-[18px] w-[18px]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Episode media attached</p>
                        <p className="text-xs text-emerald-100/75">Ready for publishing</p>
                      </div>
                    </div>

                    <label className="cursor-pointer rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.08] hover:text-white">
                      Replace
                      <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              ) : s3.uploading ? (
                <div className="space-y-3 rounded-[22px] border border-sky-300/20 bg-sky-400/10 p-4">
                  <div className="flex items-center justify-between text-sm font-medium text-sky-100">
                    <span>Uploading episode video</span>
                    <span className="inline-flex items-center gap-2">
                      {s3.progress}%
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    </span>
                  </div>
                  <MiniProgressBar progress={s3.progress} />
                </div>
              ) : (
                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed border-white/12 bg-slate-950/65 px-5 py-4 text-center transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-slate-950/85">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300">
                    <UploadCloud className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Upload episode video</p>
                    <p className="mt-1 text-xs text-slate-500">MP4, WebM, or MOV</p>
                  </div>
                  <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}

              {s3.error && (
                <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-xs font-medium text-rose-200">
                  {s3.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
