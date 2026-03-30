import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cx } from '../utils/cx';

const COLOR_STYLES = {
  blue: {
    frame: 'from-sky-400/45 via-sky-400/12 to-white/10',
    icon: 'border-sky-300/20 bg-sky-300/15 text-sky-200',
    glow: 'shadow-[0_20px_60px_-32px_rgba(56,189,248,0.9)]',
    chart: 'from-sky-300 to-blue-500',
  },
  emerald: {
    frame: 'from-emerald-300/45 via-emerald-300/12 to-white/10',
    icon: 'border-emerald-300/20 bg-emerald-300/15 text-emerald-200',
    glow: 'shadow-[0_20px_60px_-32px_rgba(52,211,153,0.9)]',
    chart: 'from-emerald-300 to-cyan-400',
  },
  violet: {
    frame: 'from-fuchsia-300/45 via-fuchsia-300/12 to-white/10',
    icon: 'border-fuchsia-300/20 bg-fuchsia-300/15 text-fuchsia-200',
    glow: 'shadow-[0_20px_60px_-32px_rgba(217,70,239,0.9)]',
    chart: 'from-fuchsia-300 to-violet-500',
  },
  amber: {
    frame: 'from-amber-300/45 via-amber-300/12 to-white/10',
    icon: 'border-amber-200/20 bg-amber-200/15 text-amber-100',
    glow: 'shadow-[0_20px_60px_-32px_rgba(251,191,36,0.9)]',
    chart: 'from-amber-200 to-orange-500',
  },
};

function formatValue(value) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value);
}

export default function StatCard({ label, value, icon, trend, color = 'blue' }) {
  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''));
  const isNumeric = Number.isFinite(parsed);
  const [displayValue, setDisplayValue] = useState(isNumeric ? 0 : value);
  const styles = COLOR_STYLES[color] ?? COLOR_STYLES.blue;

  useEffect(() => {
    if (!isNumeric) return undefined;

    const duration = 900;
    const start = performance.now();
    let frameId = 0;

    const frame = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = parsed * eased;
      setDisplayValue(nextValue);
      if (progress < 1) {
        frameId = requestAnimationFrame(frame);
      }
    };

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [isNumeric, parsed]);

  const bars = useMemo(() => {
    const seed = Math.max(4, Math.min(9, Math.round((Math.abs(parsed || 0) % 9) + 3)));
    return Array.from({ length: 6 }, (_, index) => {
      const base = ((seed + index * 2) % 7) + 3;
      return `${base * 10}%`;
    });
  }, [parsed]);

  return (
    <div className={cx('group rounded-[30px] bg-gradient-to-br p-[1px] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl', styles.frame)}>
      <div className={cx('admin-card admin-card-hover h-full rounded-[29px] p-5', styles.glow)}>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_32%,rgba(56,189,248,0.08))]" />
        <div className="relative flex h-full flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                {label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {isNumeric ? formatValue(displayValue) : value}
              </p>
            </div>

            <div className={cx('flex h-12 w-12 items-center justify-center rounded-2xl border', styles.icon)}>
              {icon}
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between gap-4">
            {trend !== undefined ? (
              <div className={cx(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold',
                trend >= 0
                  ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200'
                  : 'border-rose-300/20 bg-rose-400/12 text-rose-200',
              )}>
                {trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(trend)}% this month
              </div>
            ) : <span />}

            <div className="flex h-10 items-end gap-1.5">
              {bars.map((height, index) => (
                <span
                  key={`${label}-${index}`}
                  className={cx('w-2 rounded-full bg-gradient-to-t opacity-90 transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5', styles.chart)}
                  style={{ height }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
