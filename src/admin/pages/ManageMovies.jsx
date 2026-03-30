import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MovieTable from '../components/MovieTable';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useAdminMovies } from '../hooks/useAdminMovies';
import { GENRES } from '../services/mockAdminData';
import EditMovieModal from '../components/EditMovieModal';

export default function ManageMovies() {
  const { movies, loading, remove, update } = useAdminMovies();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editTarget, setEditTarget] = useState(null);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
      const matchGenre = !genreFilter || m.genre === genreFilter;
      const matchStatus = !statusFilter || m.status === statusFilter;
      return matchSearch && matchGenre && matchStatus;
    });
  }, [movies, search, genreFilter, statusFilter]);

  const handleDelete = async (id) => {
    try {
      await remove(id);
      toast.success('Movie deleted');
    } catch {
      toast.error('Failed to delete movie');
    }
  };

  const handleSaveEdit = async (id, payload) => {
    try {
      await update(id, payload);
      setEditTarget(null);
      toast.success('Movie updated');
    } catch {
      toast.error('Failed to update movie');
    }
  };

  return (
    <>
      <div className="max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500 w-52 transition-colors"
              />
            </div>

            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="bg-gray-900 border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">All Genres</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {(search || genreFilter || statusFilter) && (
              <button
                onClick={() => { setSearch(''); setGenreFilter(''); setStatusFilter(''); }}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors underline"
              >
                Clear filters
              </button>
            )}
          </div>

          <Link
            to="/admin/upload"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Upload Movie
          </Link>
        </div>

        <div className="text-gray-500 text-xs">
          Showing {filtered.length} of {movies.length} movies
        </div>

        <MovieTable
          movies={filtered}
          loading={loading}
          onEdit={setEditTarget}
          onDelete={handleDelete}
        />
      </div>

      {editTarget && (
        <EditMovieModal
          movie={editTarget}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </>
  );
}
