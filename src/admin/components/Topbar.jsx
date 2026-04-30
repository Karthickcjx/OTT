import { BellDot, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Topbar({ title, description }) {
  const { user } = useApp();

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="admin-card overflow-hidden px-5 py-4 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,rgba(56,189,248,0.08))]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Playnix Control Room
            </p>
            <div className="mt-2 flex flex-col gap-2 xl:flex-row xl:items-end xl:gap-4">
              <h1 className="admin-display text-2xl font-semibold text-white sm:text-[1.85rem]">
                {title}
              </h1>
              {description && (
                <p className="max-w-2xl text-sm text-slate-400">{description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 md:inline-flex">
              <ShieldCheck className="h-4 w-4" />
              System Stable
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              aria-label="Notifications"
            >
              <BellDot className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.05] px-3 py-2.5 backdrop-blur-xl">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white leading-tight">
                  {user?.name ?? 'admin'}
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-fuchsia-300/20 playnix-gradient-bg text-sm font-bold text-white shadow-[0_14px_30px_-18px_rgba(236,72,153,0.95)]">
                {user?.name?.charAt(0).toUpperCase() ?? 'A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
