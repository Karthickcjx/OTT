import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  ListFilter,
  Plus,
  Tv,
} from 'lucide-react';
import ContentTable from '../components/ContentTable';
import EditMovieModal from '../components/EditMovieModal';
import ManageContentFilters from '../components/ManageContentFilters';
import ManageContentViewMode from '../components/ManageContentViewMode';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useAdminContent } from '../hooks/useAdminContent';
import { GENRES } from '../services/mockAdminData';
import {
  SectionCard,
  SectionHeader,
  TogglePills,
} from '../components/AdminPrimitives';

const STATUS_FILTERS = [
  { label: 'All Status', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

export default function ManageContent() {
  const { content, movies, series, loading, remove, update } = useAdminContent();
  const toast = useToast();

  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [editTarget, setEditTarget] = useState(null);

  const deferredSearch = useDeferredValue(search);

  const baseItems = typeFilter === 'movie'
    ? movies
    : typeFilter === 'series'
    ? series
    : content;

  const filtered = useMemo(() => {
    return baseItems.filter((item) => {
      const matchSearch = !deferredSearch || item.title.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchGenre = !genreFilter || item.genre === genreFilter;
      const matchStatus = !statusFilter || item.status === statusFilter;
      return matchSearch && matchGenre && matchStatus;
    });
  }, [baseItems, deferredSearch, genreFilter, statusFilter]);

  const handleDelete = async (item) => {
    try {
      await remove(item);
      toast.success(`"${item.title}" deleted`);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSaveEdit = async (id, payload) => {
    try {
      await update(id, editTarget.type, payload);
      setEditTarget(null);
      toast.success('Updated successfully');
    } catch {
      toast.error('Failed to update');
    }
  };

  const tabs = [
    { key: 'all', label: `All (${content.length})` },
    { key: 'movie', label: `Movies (${movies.length})` },
    { key: 'series', label: `Series (${series.length})` },
  ];

  const clearFilters = () => {
    setSearch('');
    setGenreFilter('');
    setStatusFilter('');
  };

  const hasActiveFilters = Boolean(search || genreFilter || statusFilter);

  return (
    <>
      <div className="space-y-6">
        <SectionCard className="p-6 sm:p-7">
          <SectionHeader
            icon={ListFilter}
            eyebrow="Catalogue Operations"
            title="Manage content"
            description="Browse movies and series with poster-first previews, smart filters, and flexible card or table views."
            action={(
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/admin/upload"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/12 px-4 py-2.5 text-sm font-semibold text-sky-100 transition-all duration-300 ease-in-out hover:border-sky-300/30 hover:bg-sky-400/18"
                >
                  <Plus className="h-4 w-4" />
                  Movie
                </Link>
                <Link
                  to="/admin/upload-series"
                  className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/12 px-4 py-2.5 text-sm font-semibold text-fuchsia-100 transition-all duration-300 ease-in-out hover:border-fuchsia-300/30 hover:bg-fuchsia-400/18"
                >
                  <Plus className="h-4 w-4" />
                  Series
                </Link>
              </div>
            )}
          />

          <div className="mt-7 space-y-5">
            <TogglePills
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { label: tabs[0].label, value: 'all', icon: ListFilter },
                { label: tabs[1].label, value: 'movie', icon: Film },
                { label: tabs[2].label, value: 'series', icon: Tv },
              ]}
            />

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              <div className="min-w-0 lg:col-span-2">
                <ManageContentFilters
                  search={search}
                  onSearchChange={setSearch}
                  genreFilter={genreFilter}
                  onGenreChange={setGenreFilter}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  genres={GENRES}
                  statusFilters={STATUS_FILTERS}
                  onClear={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>

              <div className="min-w-0 lg:col-span-1 lg:sticky lg:top-6">
                <ManageContentViewMode
                  viewMode={viewMode}
                  onChange={setViewMode}
                  resultCount={filtered.length}
                  totalCount={content.length}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <ContentTable
          items={filtered}
          loading={loading}
          onEdit={setEditTarget}
          onDelete={handleDelete}
          viewMode={viewMode}
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
