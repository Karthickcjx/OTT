import { useState } from 'react';
import { PencilLine, X } from 'lucide-react';
import { GENRES } from '../services/mockAdminData';
import {
  FloatingInput,
  FloatingSelect,
  SectionHeader,
} from './AdminPrimitives';

export default function EditMovieModal({ movie, onSave, onClose }) {
  const [form, setForm] = useState({
    title: movie.title ?? '',
    genre: movie.genre ?? '',
    releaseYear: String(movie.releaseYear ?? ''),
    duration: String(movie.duration ?? ''),
    rating: String(movie.rating ?? ''),
    status: movie.status ?? 'draft',
  });
  const [saving, setSaving] = useState(false);

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    await onSave(movie.id, {
      ...form,
      releaseYear: Number(form.releaseYear),
      duration: Number(form.duration),
      rating: form.rating ? Number(form.rating) : null,
    });

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" onClick={onClose} />

      <div className="admin-card relative z-10 w-full max-w-2xl p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <SectionHeader
          icon={PencilLine}
          eyebrow="Quick Edit"
          title={`Edit ${movie.type === 'series' ? 'series' : 'movie'}`}
          description="Adjust the key catalogue details without leaving the management view."
        />

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <FloatingInput
            label="Title"
            value={form.title}
            onChange={setField('title')}
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FloatingSelect label="Genre" value={form.genre} onChange={setField('genre')}>
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </FloatingSelect>

            <FloatingSelect label="Status" value={form.status} onChange={setField('status')}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </FloatingSelect>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FloatingInput
              label="Year"
              type="number"
              value={form.releaseYear}
              onChange={setField('releaseYear')}
            />
            <FloatingInput
              label="Duration"
              type="number"
              value={form.duration}
              onChange={setField('duration')}
            />
            <FloatingInput
              label="Rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={form.rating}
              onChange={setField('rating')}
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full border border-sky-300/20 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_46px_-24px_rgba(59,130,246,0.95)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
