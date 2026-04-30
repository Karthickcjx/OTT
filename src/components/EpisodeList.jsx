import { useState } from 'react';
import { ChevronRight, Play } from 'lucide-react';

function EpisodeCard({ episode, isPlaying, onPlay }) {
  return (
    <button
      onClick={() => onPlay(episode)}
      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all group ${
        isPlaying
          ? 'bg-fuchsia-500/15 border border-fuchsia-300/30 playnix-focus'
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      {/* Thumbnail / play indicator */}
      <div className="relative w-28 aspect-video bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center">
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-0.5 animate-pulse rounded-full playnix-gradient-bg" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          ) : (
            <div className="w-7 h-7 bg-white/20 backdrop-blur group-hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current text-white" />
            </div>
          )}
        </div>
        <span className="absolute bottom-1 right-1.5 text-white text-[10px] font-mono bg-black/60 px-1 rounded">
          {episode.duration ? `${episode.duration}m` : '--'}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${isPlaying ? 'text-fuchsia-300' : 'text-gray-500'}`}>
              Ep {episode.episodeNumber}
            </p>
            <p className={`text-sm font-medium leading-snug line-clamp-2 ${isPlaying ? 'text-white' : 'text-gray-200 group-hover:text-white transition-colors'}`}>
              {episode.title || `Episode ${episode.episodeNumber}`}
            </p>
          </div>
          {isPlaying && (
            <span className="text-fuchsia-300 text-xs font-medium flex-shrink-0 mt-0.5">Now Playing</span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function EpisodeList({ seasons, activeSeason, activeEpisode, onEpisodeSelect, onSeasonChange }) {
  const [open, setOpen] = useState(true);

  if (!seasons?.length) return null;

  const currentSeason = seasons.find((s) => s.seasonNumber === activeSeason) ?? seasons[0];

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#101014]/88">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-white font-semibold text-sm"
        >
          <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} />
          Episodes
          <span className="text-gray-500 text-xs font-normal ml-1">
            {currentSeason.episodes.length} in season
          </span>
        </button>

        {/* Season selector */}
        {seasons.length > 1 && (
          <select
            value={activeSeason}
            onChange={(e) => onSeasonChange(Number(e.target.value))}
            className="bg-gray-800 border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-fuchsia-400 transition-colors appearance-none"
          >
            {seasons.map((s) => (
              <option key={s.seasonNumber} value={s.seasonNumber}>
                Season {s.seasonNumber}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Episode list */}
      {open && (
        <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto scrollbar-hide p-2 space-y-0.5">
          {currentSeason.episodes.map((ep) => (
            <EpisodeCard
              key={ep.episodeNumber}
              episode={ep}
              isPlaying={activeSeason === currentSeason.seasonNumber && activeEpisode === ep.episodeNumber}
              onPlay={() => onEpisodeSelect(currentSeason.seasonNumber, ep.episodeNumber)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
