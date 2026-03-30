import { useState } from 'react';
import { PLACEHOLDER_COLORS } from '../../services/mockData';

function StatusBadge({ status }) {
  const styles = {
    published: 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50',
    draft: 'bg-amber-900/40 text-amber-400 border-amber-800/50',
    processing: 'bg-blue-900/40 text-blue-400 border-blue-800/50',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] ?? styles.draft}`}>
      {status ?? 'draft'}
    </span>
  );
}

function ConfirmModal({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-white text-center font-semibold mb-1.5">Delete Movie</h3>
        <p className="text-gray-400 text-sm text-center mb-5">
          Are you sure you want to delete <span className="text-white font-medium">"{title}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MovieTable({ movies, onEdit, onDelete, loading }) {
  const [pendingDelete, setPendingDelete] = useState(null);

  const confirmDelete = (movie) => setPendingDelete(movie);

  const handleConfirm = () => {
    if (pendingDelete) { onDelete(pendingDelete.id); setPendingDelete(null); }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No movies yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900/80 border-b border-white/5">
              {['Movie', 'Genre', 'Year', 'Rating', 'Views', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left text-gray-400 font-medium text-xs uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {movies.map((movie) => {
              const color = PLACEHOLDER_COLORS[movie.id % PLACEHOLDER_COLORS.length];
              return (
                <tr key={movie.id} className="bg-gray-900/40 hover:bg-gray-800/60 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br ${color}`}>
                        {movie.thumbnailUrl && (
                          <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium leading-tight line-clamp-1">{movie.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{movie.duration} min</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{movie.genre}</td>
                  <td className="px-4 py-3 text-gray-400">{movie.releaseYear}</td>
                  <td className="px-4 py-3">
                    <span className="text-yellow-400 font-semibold">★ {movie.rating?.toFixed(1)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {movie.views?.toLocaleString() ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={movie.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(movie)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(movie)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
