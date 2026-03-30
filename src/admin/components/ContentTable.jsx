import { Fragment, useState } from 'react';
import {
  ChevronRight,
  Clapperboard,
  Pencil,
  Play,
  Star,
  Trash2,
} from 'lucide-react';
import SeriesExpandPanel from './SeriesExpandPanel';
import {
  EmptyState,
  PosterThumb,
} from './AdminPrimitives';
import { cx } from '../utils/cx';

function TypeBadge({ type }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
      type === 'series'
        ? 'border-fuchsia-300/20 bg-fuchsia-400/12 text-fuchsia-100'
        : 'border-sky-300/20 bg-sky-400/12 text-sky-100'
    }`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    published: 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200',
    draft: 'border-amber-300/20 bg-amber-400/12 text-amber-100',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
      styles[status] ?? styles.draft
    }`}>
      {status ?? 'draft'}
    </span>
  );
}

function ConfirmModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" onClick={onCancel} />
      <div className="admin-card relative z-10 w-full max-w-md p-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-rose-300/20 bg-rose-400/12 text-rose-200">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className="admin-display mt-4 text-center text-xl font-semibold text-white">
          Delete Content
        </h3>
        <p className="mt-2 text-center text-sm leading-6 text-slate-400">
          Delete <span className="font-semibold text-white">"{title}"</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full border border-rose-300/20 bg-rose-400/12 px-4 py-3 text-sm font-semibold text-rose-100 transition-all duration-300 ease-in-out hover:bg-rose-400/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentCard({ item, onEdit, onDelete }) {
  const isSeries = item.type === 'series';
  const seasonCount = item.seasons?.length ?? 0;
  const episodeCount = item.seasons?.reduce((sum, season) => sum + season.episodes.length, 0) ?? 0;

  return (
    <div className="admin-card admin-card-hover overflow-hidden p-3">
      <PosterThumb
        title={item.title}
        subtitle={item.genre}
        imageUrl={item.thumbnailUrl}
        type={item.type}
        className="aspect-[16/10] w-full"
        overlay={(
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl">
              <Play className="h-5 w-5 fill-current" />
            </span>
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 ease-in-out hover:bg-white/15"
            >
              Edit
            </button>
          </div>
        )}
      />

      <div className="space-y-4 px-2 pb-2 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={item.type} />
          <StatusBadge status={item.status} />
        </div>

        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {isSeries
              ? `${seasonCount} season${seasonCount !== 1 ? 's' : ''} | ${episodeCount} episodes`
              : `${item.duration ?? '?'} min | ${item.releaseYear}`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] p-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Genre</p>
            <p className="mt-1 line-clamp-1 text-sm font-medium text-white">{item.genre}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Rating</p>
            <p className="mt-1 text-sm font-medium text-amber-100">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current" />
                {item.rating?.toFixed(1) ?? 'N/A'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Views</p>
            <p className="mt-1 text-sm font-medium text-white">
              {item.views?.toLocaleString('en-IN') ?? '0'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition-all duration-300 ease-in-out hover:bg-rose-400/18"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContentTable({
  items,
  onEdit,
  onDelete,
  loading,
  viewMode = 'table',
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleConfirm = () => {
    if (pendingDelete) {
      onDelete(pendingDelete);
      setPendingDelete(null);
    }
  };

  if (loading) {
    if (viewMode === 'grid') {
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="admin-skeleton h-[420px] rounded-[28px]" />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="admin-skeleton h-24 rounded-[26px]" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={Clapperboard}
        title="No content found"
        description="Adjust your search or filters to reveal more of the catalogue."
      />
    );
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ContentCard
              key={`${item.type}-${item.id}`}
              item={item}
              onEdit={onEdit}
              onDelete={(nextItem) => setPendingDelete(nextItem)}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/55">
                {['Content', 'Type', 'Genre', 'Year', 'Rating', 'Views', 'Status', 'Actions'].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/8">
              {items.map((item) => {
                const isExpanded = expandedId === item.id;
                const isSeries = item.type === 'series';
                const seasonCount = item.seasons?.length ?? 0;
                const episodeCount = item.seasons?.reduce((sum, season) => sum + season.episodes.length, 0) ?? 0;

                return (
                  <Fragment key={`${item.type}-${item.id}`}>
                    <tr className={cx(
                      'group transition-all duration-300 ease-in-out',
                      isExpanded ? 'bg-white/[0.06]' : 'bg-transparent hover:bg-white/[0.04]',
                    )}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          {isSeries && (
                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                            >
                              <ChevronRight className={cx('h-4 w-4 transition-transform duration-300 ease-in-out', isExpanded ? 'rotate-90' : '')} />
                            </button>
                          )}

                          <PosterThumb
                            title={item.title}
                            subtitle={item.genre}
                            imageUrl={item.thumbnailUrl}
                            type={item.type}
                            className="h-24 w-16 flex-shrink-0"
                          />

                          <div className="min-w-0">
                            <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {isSeries
                                ? `${seasonCount} season${seasonCount !== 1 ? 's' : ''} | ${episodeCount} episodes`
                                : `${item.duration ?? '?'} min`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4"><TypeBadge type={item.type} /></td>
                      <td className="px-5 py-4 text-slate-300">{item.genre}</td>
                      <td className="px-5 py-4 text-slate-300">{item.releaseYear}</td>
                      <td className="px-5 py-4 text-amber-100">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {item.rating?.toFixed(1) ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-300">{item.views?.toLocaleString('en-IN') ?? '0'}</td>
                      <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(item)}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-300/15 bg-rose-400/8 text-rose-100 transition-all duration-300 ease-in-out hover:bg-rose-400/18"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && isSeries && (
                      <tr>
                        <td colSpan={8} className="bg-slate-950/35">
                          <SeriesExpandPanel series={item} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pendingDelete && (
        <ConfirmModal
          title={pendingDelete.title}
          onConfirm={handleConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  );
}
