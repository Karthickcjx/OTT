import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarRange,
  CheckCircle2,
  Clapperboard,
  FileVideo2,
  ImagePlus,
  Sparkles,
  Star,
  Timer,
  WandSparkles,
} from 'lucide-react';
import FileUploadInput from '../components/FileUploadInput';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useS3Upload } from '../hooks/useS3Upload';
import { createMovie } from '../services/adminApi';
import { GENRES } from '../services/mockAdminData';
import {
  FloatingInput,
  FloatingSelect,
  FloatingTextarea,
  SectionCard,
  SectionHeader,
} from '../components/AdminPrimitives';

const CURRENT_YEAR = new Date().getFullYear();

const INITIAL_FORM = {
  title: '',
  description: '',
  genre: '',
  releaseYear: String(CURRENT_YEAR),
  duration: '',
  rating: '',
};

function validate(form, thumbnailUrl, videoUrl) {
  const errors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  if (!form.description.trim()) errors.description = 'Description is required';
  if (!form.genre) errors.genre = 'Select a genre';
  if (!form.releaseYear || isNaN(form.releaseYear)) errors.releaseYear = 'Enter a valid year';
  if (!form.duration || isNaN(form.duration)) errors.duration = 'Enter duration in minutes';
  if (form.rating && (isNaN(form.rating) || form.rating < 0 || form.rating > 10)) {
    errors.rating = 'Rating must be between 0 and 10';
  }
  if (!thumbnailUrl) errors.thumbnail = 'Upload a thumbnail';
  if (!videoUrl) errors.video = 'Upload a video file';
  return errors;
}

function ChecklistItem({ complete, children }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-2xl border ${
          complete
            ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200'
            : 'border-white/10 bg-white/[0.04] text-slate-500'
        }`}
      >
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <span className={complete ? 'text-white' : 'text-slate-400'}>{children}</span>
    </div>
  );
}

export default function UploadMovie() {
  const navigate = useNavigate();
  const toast = useToast();
  const thumbnail = useS3Upload();
  const video = useS3Upload();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleThumbnailUpload = async (file) => {
    setErrors((current) => ({ ...current, thumbnail: undefined }));
    const url = await thumbnail.upload(file);
    if (!url) toast.error('Thumbnail upload failed');
  };

  const handleVideoUpload = async (file) => {
    setErrors((current) => ({ ...current, video: undefined }));
    const url = await video.upload(file);
    if (!url) toast.error('Video upload failed');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form, thumbnail.url, video.url);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        genre: form.genre,
        releaseYear: Number(form.releaseYear),
        thumbnailUrl: thumbnail.url,
        videoUrl: video.url,
        duration: Number(form.duration),
        rating: form.rating ? Number(form.rating) : null,
        status: 'published',
      };

      await createMovie(payload);
      toast.success('Movie uploaded successfully!');
      setTimeout(() => navigate('/admin/content'), 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit movie');
    } finally {
      setSubmitting(false);
    }
  };

  const uploading = thumbnail.uploading || video.uploading;
  const blocked = submitting || uploading;
  const completionCount = [
    Boolean(form.title.trim()),
    Boolean(form.description.trim()),
    Boolean(form.genre),
    Boolean(thumbnail.url),
    Boolean(video.url),
  ].filter(Boolean).length;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <SectionCard className="p-6 sm:p-7">
              <SectionHeader
                icon={Clapperboard}
                eyebrow="Release Metadata"
                title="Craft the movie profile"
                description="Shape the title, synopsis, and release details with a clean cinematic hierarchy."
                action={(
                  <div className="rounded-full border border-sky-300/20 bg-sky-400/12 px-4 py-2 text-sm font-semibold text-sky-100">
                    Publishes live on submit
                  </div>
                )}
              />

              <div className="mt-7 space-y-5">
                <FloatingInput
                  label="Movie title *"
                  value={form.title}
                  onChange={setField('title')}
                  error={errors.title}
                  autoComplete="off"
                />

                <FloatingTextarea
                  label="Description *"
                  value={form.description}
                  onChange={setField('description')}
                  error={errors.description}
                  rows={5}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <FloatingSelect
                    label="Genre *"
                    value={form.genre}
                    onChange={setField('genre')}
                    error={errors.genre}
                  >
                    <option value="">Select genre</option>
                    {GENRES.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </FloatingSelect>

                  <FloatingInput
                    label="Release year *"
                    type="number"
                    min="1900"
                    max={CURRENT_YEAR + 2}
                    value={form.releaseYear}
                    onChange={setField('releaseYear')}
                    error={errors.releaseYear}
                    inputMode="numeric"
                  />

                  <FloatingInput
                    label="Duration (min) *"
                    type="number"
                    min="1"
                    max="600"
                    value={form.duration}
                    onChange={setField('duration')}
                    error={errors.duration}
                    inputMode="numeric"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300">
                        <WandSparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Premium placement</p>
                        <p className="text-xs text-slate-400">
                          Clean metadata improves browse quality and featured visibility.
                        </p>
                      </div>
                    </div>
                  </div>

                  <FloatingInput
                    label="Rating (0-10)"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={form.rating}
                    onChange={setField('rating')}
                    error={errors.rating}
                    inputMode="decimal"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard className="p-6 sm:p-7">
              <SectionHeader
                icon={FileVideo2}
                eyebrow="Media Assets"
                title="Attach artwork and source media"
                description="Use rich previews, progress feedback, and drag-and-drop uploads for release assets."
              />

              <div className="mt-7 grid gap-6 lg:grid-cols-2">
                <div>
                  <FileUploadInput
                    label="Thumbnail image *"
                    accept="image/jpeg,image/png,image/webp"
                    uploadState={thumbnail}
                    onUpload={handleThumbnailUpload}
                    preview
                  />
                  {errors.thumbnail && (
                    <p className="mt-2 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-xs font-medium text-rose-200">
                      {errors.thumbnail}
                    </p>
                  )}
                </div>

                <div>
                  <FileUploadInput
                    label="Video file *"
                    accept="video/mp4,video/webm,video/mov"
                    uploadState={video}
                    onUpload={handleVideoUpload}
                  />
                  {errors.video && (
                    <p className="mt-2 rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-xs font-medium text-rose-200">
                      {errors.video}
                    </p>
                  )}
                </div>
              </div>

              {(thumbnail.uploading || video.uploading) && (
                <div className="mt-6 rounded-[24px] border border-sky-300/20 bg-sky-400/10 px-4 py-4 text-sm text-sky-100">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4" />
                    {thumbnail.uploading
                      ? `Uploading thumbnail asset... ${thumbnail.progress}%`
                      : `Uploading movie source... ${video.progress}%`}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard className="p-5">
              <SectionHeader
                icon={Star}
                eyebrow="Readiness"
                title={`${completionCount}/5 essentials ready`}
                description="Keep an eye on the required fields before publishing."
              />

              <div className="mt-6 space-y-3">
                <ChecklistItem complete={Boolean(form.title.trim())}>Title added</ChecklistItem>
                <ChecklistItem complete={Boolean(form.description.trim())}>Synopsis written</ChecklistItem>
                <ChecklistItem complete={Boolean(form.genre)}>Genre selected</ChecklistItem>
                <ChecklistItem complete={Boolean(thumbnail.url)}>Thumbnail uploaded</ChecklistItem>
                <ChecklistItem complete={Boolean(video.url)}>Source video uploaded</ChecklistItem>
              </div>
            </SectionCard>

            <SectionCard className="p-5">
              <SectionHeader
                icon={CalendarRange}
                eyebrow="Release Snapshot"
                title={form.title || 'Untitled release'}
                description="A quick operational summary for the movie currently being prepared."
              />

              <div className="mt-6 grid gap-3">
                {[
                  { label: 'Genre', value: form.genre || 'Choose genre', icon: Sparkles },
                  { label: 'Year', value: form.releaseYear || String(CURRENT_YEAR), icon: CalendarRange },
                  { label: 'Runtime', value: form.duration ? `${form.duration} min` : 'Pending', icon: Timer },
                  { label: 'Rating', value: form.rating || 'Unrated', icon: Star },
                  { label: 'Artwork', value: thumbnail.url ? 'Ready' : 'Waiting for upload', icon: ImagePlus },
                  { label: 'Media', value: video.url ? 'Ready' : 'Waiting for upload', icon: FileVideo2 },
                ].map(({ label, value, icon }) => {
                  const MetricIcon = icon;

                  return (
                    <div key={label} className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300">
                        <MetricIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
                        <p className="mt-1 text-sm font-medium text-white">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </div>

        <SectionCard className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                Finalize Release
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Publish the movie only after artwork and media uploads are complete.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/content')}
                disabled={blocked}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={blocked}
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_46px_-24px_rgba(59,130,246,0.95)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_28px_56px_-24px_rgba(59,130,246,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Publish Movie'}
              </button>
            </div>
          </div>
        </SectionCard>
      </form>

      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </>
  );
}
