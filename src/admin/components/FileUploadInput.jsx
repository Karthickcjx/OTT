import { useEffect, useRef, useState } from 'react';
import {
  Check,
  FileVideo2,
  Image as ImageIcon,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';
import { cx } from '../utils/cx';

function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** power;
  return `${value.toFixed(value >= 10 || power === 0 ? 0 : 1)} ${units[power]}`;
}

function ProgressBar({ progress }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-violet-400 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function FileUploadInput({
  label,
  accept,
  uploadState,
  onUpload,
  preview = false,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const setPreviewFromFile = (file) => {
    if (!file) return;
    if (localPreview) URL.revokeObjectURL(localPreview);

    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      setLocalPreview(URL.createObjectURL(file));
      return;
    }

    setLocalPreview(null);
  };

  const handleFile = (file) => {
    if (!file) return;

    setFileMeta({
      name: file.name,
      size: file.size,
      type: file.type,
    });
    setPreviewFromFile(file);
    onUpload(file);
  };

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
    event.target.value = '';
  };

  const { uploading, progress, url, error } = uploadState;
  const isDone = Boolean(url);
  const canPreview = preview || fileMeta?.type?.startsWith('video/');
  const previewUrl = localPreview || (preview ? url : null);
  const isVideo = fileMeta?.type?.startsWith('video/');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-white">{label}</label>
        {fileMeta && (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-400">
            {formatBytes(fileMeta.size)}
          </span>
        )}
      </div>

      {canPreview && previewUrl && (
        <div className="overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/70">
          <div className="relative aspect-[16/9] overflow-hidden">
            {isVideo ? (
              <video
                src={previewUrl}
                className="h-full w-full object-cover"
                muted
                playsInline
                autoPlay
                loop
              />
            ) : (
              <img src={previewUrl} alt={`${label} preview`} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.72))]" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
              {isVideo ? <FileVideo2 className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
              Preview ready
            </div>
          </div>

          {fileMeta && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="line-clamp-1 font-medium text-white">{fileMeta.name}</p>
                <p className="mt-1 text-xs text-slate-500">{formatBytes(fileMeta.size)}</p>
              </div>
              {isDone && (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Check className="h-3.5 w-3.5" />
                  Uploaded
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          if (uploading) return;
          const file = event.dataTransfer.files?.[0];
          handleFile(file);
        }}
        className={cx(
          'group relative overflow-hidden rounded-[28px] border border-dashed p-6 transition-all duration-300 ease-in-out',
          uploading
            ? 'cursor-not-allowed border-sky-400/35 bg-sky-400/10'
            : isDone
            ? 'border-emerald-300/30 bg-emerald-400/10'
            : dragActive
            ? 'border-sky-300/40 bg-sky-400/12 shadow-[0_0_36px_-16px_rgba(56,189,248,0.95)]'
            : 'cursor-pointer border-white/12 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_24px_60px_-32px_rgba(56,189,248,0.4)]',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_48%,rgba(56,189,248,0.08))]" />

        <div className="relative flex flex-col items-center justify-center gap-4 text-center">
          <div
            className={cx(
              'flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 ease-in-out',
              isDone
                ? 'border-emerald-300/25 bg-emerald-300/15 text-emerald-200'
                : uploading || dragActive
                ? 'border-sky-300/25 bg-sky-300/15 text-sky-200'
                : 'border-white/10 bg-white/[0.06] text-slate-300 group-hover:border-white/20 group-hover:bg-white/[0.08]',
            )}
          >
            {uploading ? <RefreshCw className="h-5 w-5 animate-spin" /> : isDone ? <Check className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-white">
              {uploading
                ? `Uploading... ${progress}%`
                : isDone
                ? 'Upload complete'
                : dragActive
                ? 'Drop file to upload'
                : 'Drag and drop or browse'}
            </p>
            <p className="mx-auto max-w-sm text-sm leading-6 text-slate-400">
              {isDone
                ? fileMeta?.name || 'Your file is attached and ready.'
                : `Accepted formats: ${accept}`}
            </p>
          </div>

          {(uploading || isDone) && (
            <div className="w-full max-w-md space-y-3">
              <ProgressBar progress={isDone ? 100 : progress} />
              {fileMeta && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-medium text-white">{fileMeta.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatBytes(fileMeta.size)}</p>
                  </div>
                  {isDone && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        inputRef.current?.click();
                      }}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    >
                      Replace
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-xs font-medium text-rose-200">
          {error}
        </p>
      )}
    </div>
  );
}
