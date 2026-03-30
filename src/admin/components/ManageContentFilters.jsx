import { Search, X } from 'lucide-react';
import { cx } from '../utils/cx';

function FilterChip({ active, label, onClick, tone = 'sky' }) {
  const activeTone = tone === 'emerald'
    ? 'border-emerald-300/25 bg-emerald-400/14 text-white shadow-[0_0_24px_-16px_rgba(52,211,153,0.9)]'
    : 'border-sky-300/25 bg-sky-400/14 text-white shadow-[0_0_24px_-16px_rgba(56,189,248,0.9)]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out',
        active
          ? activeTone
          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white',
      )}
    >
      {label}
    </button>
  );
}

export default function ManageContentFilters({
  search,
  onSearchChange,
  genreFilter,
  onGenreChange,
  statusFilter,
  onStatusChange,
  genres,
  statusFilters,
  onClear,
  hasActiveFilters,
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
      <div className="grid gap-6">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
          <Search className="h-4 w-4 flex-shrink-0 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search titles, genres, and recent releases..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Genre Filters
            </p>
            <p className="text-sm text-slate-400">
              Narrow the catalogue by genre with wrapped chip filters.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[{ label: 'All Genres', value: '' }, ...genres.map((genre) => ({ label: genre, value: genre }))].map(({ label, value }) => (
              <FilterChip
                key={label}
                label={label}
                active={genreFilter === value}
                onClick={() => onGenreChange(value)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Status Filters
            </p>
            <p className="text-sm text-slate-400">
              Switch between published and draft content without leaving the page.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map(({ label, value }) => (
              <FilterChip
                key={label}
                label={label}
                active={statusFilter === value}
                onClick={() => onStatusChange(value)}
                tone="emerald"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
