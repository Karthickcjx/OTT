import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3, Tv } from 'lucide-react';
import StepIndicator from '../components/StepIndicator';
import SeriesStepInfo from '../components/SeriesStepInfo';
import SeriesStepSeasons from '../components/SeriesStepSeasons';
import SeriesStepEpisodes from '../components/SeriesStepEpisodes';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useSeriesForm } from '../hooks/useSeriesForm';
import { useS3Upload } from '../hooks/useS3Upload';
import { createSeries } from '../services/adminApi';
import { SectionCard, SectionHeader } from '../components/AdminPrimitives';

const STEP_TITLES = [
  'Series foundations',
  'Season structure',
  'Episode delivery',
];

const STEP_DESCRIPTIONS = [
  'Set the hero metadata, synopsis, status, and artwork.',
  'Define the season architecture for the release.',
  'Attach episode details and upload video assets.',
];

export default function UploadSeries() {
  const navigate = useNavigate();
  const toast = useToast();
  const form = useSeriesForm();
  const thumbnail = useS3Upload();
  const banner = useS3Upload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { step, goNext, goBack, goToStep } = form;

  const handleNext = () => {
    if (step === 0 && !form.validateInfo()) return;

    if (step === 1 && form.seasons.length === 0) {
      toast.error('Add at least one season before continuing');
      return;
    }

    goNext();
  };

  const handleThumbnailUpload = async (file) => {
    form.setInfoErrors((current) => ({ ...current, thumbnail: undefined }));
    const url = await thumbnail.upload(file);

    if (url) {
      form.setThumbnailUrl(url);
    } else {
      toast.error('Thumbnail upload failed');
    }
  };

  const handleBannerUpload = async (file) => {
    const url = await banner.upload(file);

    if (url) {
      form.setBannerUrl(url);
    } else {
      toast.error('Banner upload failed');
    }
  };

  const handleSubmit = async () => {
    const totalEpisodes = form.seasons.reduce((sum, season) => sum + season.episodes.length, 0);
    if (totalEpisodes === 0) {
      toast.error('Add at least one episode before publishing');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = form.buildPayload();
      await createSeries(payload);
      toast.success('Series published successfully!');
      setTimeout(() => navigate('/admin/content'), 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create series');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploading = thumbnail.uploading || banner.uploading;
  const totalEpisodes = form.seasons.reduce((sum, season) => sum + season.episodes.length, 0);
  const uploadedEpisodes = form.seasons.reduce(
    (sum, season) => sum + season.episodes.filter((episode) => episode.videoUrl).length,
    0,
  );

  return (
    <>
      <div className="space-y-6">
        <StepIndicator current={step} completedUpTo={step} onStepClick={goToStep} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <SectionCard className="min-h-[560px] p-6 sm:p-7">
            <div key={step} className="animate-[admin-page-enter_360ms_ease-out]">
              {step === 0 && (
                <SeriesStepInfo
                  info={form.info}
                  setInfoField={form.setInfoField}
                  errors={form.infoErrors}
                  thumbnail={thumbnail}
                  onThumbnailUpload={handleThumbnailUpload}
                  banner={banner}
                  onBannerUpload={handleBannerUpload}
                />
              )}

              {step === 1 && (
                <SeriesStepSeasons
                  seasons={form.seasons}
                  activeSeasonKey={form.activeSeasonKey}
                  onSelect={form.setActiveSeasonKey}
                  onAdd={form.addSeason}
                  onRemove={form.removeSeason}
                />
              )}

              {step === 2 && (
                <SeriesStepEpisodes
                  seasons={form.seasons}
                  activeSeasonKey={form.activeSeasonKey}
                  onSelectSeason={form.setActiveSeasonKey}
                  onAddEpisode={form.addEpisode}
                  onRemoveEpisode={form.removeEpisode}
                  onUpdateEpisode={form.updateEpisode}
                  onVideoUploaded={form.setEpisodeVideoUrl}
                />
              )}
            </div>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard className="p-5">
              <SectionHeader
                icon={Tv}
                eyebrow="Step Summary"
                title={STEP_TITLES[step]}
                description={STEP_DESCRIPTIONS[step]}
              />

              <div className="mt-6 space-y-3">
                {STEP_TITLES.map((stepTitle, index) => (
                  <div
                    key={stepTitle}
                    className={`rounded-[22px] border px-4 py-3 ${
                      index === step
                        ? 'border-sky-300/20 bg-sky-400/10'
                        : index < step
                        ? 'border-emerald-300/20 bg-emerald-400/10'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Step {index + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{stepTitle}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard className="p-5">
              <SectionHeader
                icon={Layers3}
                eyebrow="Series Snapshot"
                title={form.info.title || 'Untitled series'}
                description="Operational metrics update as you build out the release."
              />

              <div className="mt-6 grid gap-3">
                {[
                  { label: 'Status', value: form.info.status || 'published' },
                  { label: 'Seasons', value: form.seasons.length },
                  { label: 'Episodes', value: totalEpisodes },
                  { label: 'Uploaded episodes', value: `${uploadedEpisodes}/${totalEpisodes || 0}` },
                  { label: 'Thumbnail', value: thumbnail.url ? 'Ready' : 'Pending' },
                  { label: 'Banner', value: banner.url ? 'Ready' : 'Optional' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <SectionCard className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate('/admin/content')}
                className="rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-slate-400 transition-all duration-300 ease-in-out hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {step === 2 && totalEpisodes > 0 && (
                <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                  {uploadedEpisodes}/{totalEpisodes} episodes uploaded
                </div>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_46px_-24px_rgba(59,130,246,0.95)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_46px_-24px_rgba(45,212,191,0.95)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSubmitting ? 'Publishing...' : 'Publish Series'}
                </button>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </>
  );
}
