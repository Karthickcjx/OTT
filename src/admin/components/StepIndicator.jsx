import { Check, ChevronRight } from 'lucide-react';
import { cx } from '../utils/cx';

const STEPS = ['Series Info', 'Seasons', 'Episodes'];

export default function StepIndicator({ current, onStepClick, completedUpTo }) {
  const progress = ((current + 1) / STEPS.length) * 100;

  return (
    <div className="admin-card mb-6 overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%,rgba(56,189,248,0.07))]" />

      <div className="relative space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Release Builder
            </p>
            <h2 className="admin-display mt-1 text-xl font-semibold text-white">
              Series delivery workflow
            </h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300">
            Step {current + 1} of {STEPS.length}
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-violet-400 transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map((label, index) => {
            const done = index < completedUpTo;
            const active = index === current;
            const clickable = index <= completedUpTo;

            return (
              <button
                key={label}
                type="button"
                onClick={() => clickable && onStepClick(index)}
                disabled={!clickable}
                className={cx(
                  'group relative overflow-hidden rounded-[24px] border p-4 text-left transition-all duration-300 ease-in-out',
                  clickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
                  active
                    ? 'border-sky-400/28 bg-sky-400/14 shadow-[0_0_34px_-18px_rgba(56,189,248,0.9)]'
                    : done
                    ? 'border-emerald-300/20 bg-emerald-400/10'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div
                      className={cx(
                        'flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold transition-all duration-300 ease-in-out',
                        done
                          ? 'border-emerald-300/20 bg-emerald-300/15 text-emerald-100'
                          : active
                          ? 'border-sky-300/20 bg-sky-300/15 text-sky-100'
                          : 'border-white/10 bg-white/[0.04] text-slate-400',
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : index + 1}
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {index === 0 ? 'Metadata' : index === 1 ? 'Structure' : 'Delivery'}
                      </p>
                      <p className={cx('mt-1 text-sm font-semibold', active || done ? 'text-white' : 'text-slate-300')}>
                        {label}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={cx(
                      'h-4 w-4 transition-transform duration-300 ease-in-out',
                      active ? 'translate-x-0 text-sky-200' : 'translate-x-1 text-slate-600 group-hover:translate-x-0 group-hover:text-slate-400',
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
