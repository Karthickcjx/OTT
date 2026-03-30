import {
  ImagePlus,
  LayoutPanelTop,
  Sparkles,
  Tv,
} from 'lucide-react';
import FileUploadInput from './FileUploadInput';
import {
  FloatingInput,
  FloatingSelect,
  FloatingTextarea,
  SectionHeader,
  TogglePills,
} from './AdminPrimitives';
import { GENRES } from '../services/mockAdminData';

export default function SeriesStepInfo({
  info,
  setInfoField,
  errors,
  thumbnail,
  onThumbnailUpload,
  banner,
  onBannerUpload,
}) {
  return (
    <div className="space-y-7">
      <SectionHeader
        icon={Tv}
        eyebrow="Step 1"
        title="Series foundations"
        description="Set the hero metadata, release attributes, and artwork before structuring seasons."
      />

      <div className="space-y-5">
        <FloatingInput
          label="Series title *"
          value={info.title}
          onChange={(event) => setInfoField('title', event.target.value)}
          error={errors.title}
          autoComplete="off"
        />

        <FloatingTextarea
          label="Description *"
          value={info.description}
          onChange={(event) => setInfoField('description', event.target.value)}
          error={errors.description}
          rows={5}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FloatingSelect
            label="Genre *"
            value={info.genre}
            onChange={(event) => setInfoField('genre', event.target.value)}
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
            max={new Date().getFullYear() + 2}
            value={info.releaseYear}
            onChange={(event) => setInfoField('releaseYear', event.target.value)}
            error={errors.releaseYear}
            inputMode="numeric"
          />

          <FloatingInput
            label="Rating (0-10)"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={info.rating}
            onChange={(event) => setInfoField('rating', event.target.value)}
            inputMode="decimal"
          />
        </div>
      </div>

      <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Release Status
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Choose how the series should enter the catalogue once publishing is complete.
            </p>
          </div>

          <TogglePills
            value={info.status}
            onChange={(value) => setInfoField('status', value)}
            options={[
              { label: 'Published', value: 'published', icon: Sparkles },
              { label: 'Draft', value: 'draft', icon: LayoutPanelTop },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <FileUploadInput
            label="Thumbnail image *"
            accept="image/jpeg,image/png,image/webp"
            uploadState={thumbnail}
            onUpload={onThumbnailUpload}
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
            label="Banner / hero image"
            accept="image/jpeg,image/png,image/webp"
            uploadState={banner}
            onUpload={onBannerUpload}
            preview
          />
          <p className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
            <ImagePlus className="h-3.5 w-3.5" />
            Used as the widescreen hero treatment across feature placements.
          </p>
        </div>
      </div>
    </div>
  );
}
