import { useApp } from '../context/AppContext';
import { cx } from '../admin/utils/cx';

export function CardSkeleton({ kids = false }) {
  return (
    <div className={kids ? 'w-52 flex-shrink-0 sm:w-56 lg:w-60' : 'w-40 flex-shrink-0 sm:w-44 lg:w-48'}>
      <div className="stream-skeleton aspect-[2/3] rounded-[28px]" />
      <div className="mt-3 space-y-2">
        <div className="stream-skeleton h-3 rounded-full" />
        <div className="stream-skeleton h-3 w-2/3 rounded-full" />
      </div>
    </div>
  );
}

export function RowSkeleton({ kids = false }) {
  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="mb-5 space-y-3">
        <div className="stream-skeleton h-4 w-36 rounded-full" />
        <div className="stream-skeleton h-8 w-56 rounded-full" />
        <div className="stream-skeleton h-3 w-72 rounded-full" />
      </div>

      <div className="scrollbar-hide flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} kids={kids} />
        ))}
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative min-h-[92vh] overflow-hidden">
      <div className="stream-skeleton absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.95),rgba(2,6,23,0.72)_36%,rgba(2,6,23,0.18)_72%,rgba(2,6,23,0.88))]" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-[1600px] items-end px-4 pb-24 pt-28 sm:px-6 lg:px-10">
        <div className="w-full max-w-3xl space-y-5">
          <div className="stream-skeleton h-10 w-48 rounded-full" />
          <div className="stream-skeleton h-20 w-full max-w-2xl rounded-[32px]" />
          <div className="stream-skeleton h-5 w-3/4 rounded-full" />
          <div className="stream-skeleton h-5 w-2/3 rounded-full" />
          <div className="flex flex-wrap gap-3 pt-3">
            <div className="stream-skeleton h-12 w-36 rounded-full" />
            <div className="stream-skeleton h-12 w-44 rounded-full" />
            <div className="stream-skeleton h-12 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Loader() {
  const { settings, isKidsMode } = useApp();
  const isLight = settings.theme === 'light' && !isKidsMode;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="stream-card w-full max-w-md rounded-[34px] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/10">
          <div className="h-10 w-10 rounded-full border-4 border-sky-400 border-t-transparent animate-spin" />
        </div>
        <h2 className={cx('admin-display mt-6 text-2xl font-semibold', isLight ? 'text-slate-900' : 'text-white')}>
          Loading your stream
        </h2>
        <p className={cx('mt-3 text-sm leading-6', isLight ? 'text-slate-600' : 'text-slate-400')}>
          Pulling artwork, rows, and playback controls into place.
        </p>
      </div>
    </div>
  );
}
