import { createElement } from 'react';
import { LayoutGrid, Table2 } from 'lucide-react';
import { cx } from '../utils/cx';

const ICONS = {
  table: Table2,
  grid: LayoutGrid,
};

export default function ManageContentViewMode({
  viewMode,
  onChange,
  resultCount,
  totalCount,
}) {
  const ActiveIcon = ICONS[viewMode] ?? Table2;

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sky-300">
              <ActiveIcon className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                View Mode
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                {viewMode === 'table' ? 'Table view' : 'Card view'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Switch between a compact operations table and poster-led content cards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Table', value: 'table', icon: Table2 },
              { label: 'Cards', value: 'grid', icon: LayoutGrid },
            ].map(({ label, value, icon: Icon }) => {
              const active = viewMode === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange(value)}
                  className={cx(
                    'inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ease-in-out',
                    active
                      ? 'border-sky-300/25 bg-sky-400/14 text-white shadow-[0_0_24px_-16px_rgba(56,189,248,0.9)]'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white',
                  )}
                >
                  {createElement(Icon, { className: 'h-4 w-4' })}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Result Summary
        </p>
        <p className="mt-2 text-3xl font-semibold text-white">{resultCount}</p>
        <p className="mt-1 text-sm text-slate-400">
          matching titles out of {totalCount}
        </p>
      </section>
    </div>
  );
}
