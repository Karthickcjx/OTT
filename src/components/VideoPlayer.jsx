import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Frown,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPlayer({ title = 'Movie Title', videoUrl, posterUrl, onEnded }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const hideControlsTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [videoError, setVideoError] = useState(false);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    if (playing) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    return () => clearTimeout(hideControlsTimer.current);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVideoError(false);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [videoUrl]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number.parseFloat(event.target.value);
    if (videoRef.current) videoRef.current.volume = nextVolume;
    setVolume(nextVolume);
    setMuted(nextVolume === 0);
  };

  const handleSeek = (event) => {
    if (!progressRef.current || !videoRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const time = ratio * duration;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;

    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0 && v.duration) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const skip = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasSource = Boolean(videoUrl) && !videoError;

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full select-none bg-black"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      onClick={togglePlay}
    >
      {!hasSource ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Frown className="h-12 w-12 opacity-50" />
          <p className="text-sm">
            {videoError ? 'Video unavailable. Check S3 access or re-upload.' : 'No video source.'}
          </p>
        </div>
      ) : (
        <video
          ref={videoRef}
          key={videoUrl}
          className="h-full w-full object-contain"
          poster={posterUrl || undefined}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setPlaying(false);
            onEnded?.();
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setVideoError(true)}
        >
          <source src={videoUrl} />
        </video>
      )}

      {!playing && hasSource && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_0_42px_-18px_rgba(236,72,153,0.96)] backdrop-blur-sm">
            <Play className="ml-1 h-8 w-8 fill-current" />
          </div>
        </div>
      )}

      {hasSource && (
        <div
          className={`absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300 md:p-6 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: showControls
              ? 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 42%, rgba(0,0,0,0.35) 100%)'
              : 'transparent',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="text-lg font-semibold text-white drop-shadow">{title}</div>

          <div className="space-y-3">
            <div
              ref={progressRef}
              className="group/progress relative h-2 w-full cursor-pointer rounded-full bg-white/20"
              onClick={handleSeek}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white/30"
                style={{ width: `${buffered}%` }}
              />
              <div
                className="absolute left-0 top-0 h-full rounded-full playnix-gradient-bg shadow-[0_0_22px_-10px_rgba(236,72,153,0.95)] transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover/progress:opacity-100"
                style={{ left: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 md:gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1 text-white transition-colors hover:text-fuchsia-300"
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={() => skip(-10)}
                  className="p-1 text-white transition-colors hover:text-fuchsia-300"
                  aria-label="Skip back 10 seconds"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => skip(10)}
                  className="p-1 text-white transition-colors hover:text-fuchsia-300"
                  aria-label="Skip forward 10 seconds"
                >
                  <RotateCw className="h-5 w-5" />
                </button>

                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 text-white transition-colors hover:text-fuchsia-300"
                    aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="h-1 w-20 cursor-pointer accent-pink-500"
                    aria-label="Volume"
                  />
                </div>

                <span className="truncate font-mono text-xs tabular-nums text-white sm:text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1 text-white transition-colors hover:text-fuchsia-300"
                aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
