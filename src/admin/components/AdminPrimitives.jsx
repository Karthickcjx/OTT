import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../utils/cx';

export function SectionCard({ className = '', children }) {
  return (
    <section className={cx('admin-card relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_34%)] opacity-80" />
      <div className="relative">{children}</div>
    </section>
  );
}

export function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={cx('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sky-300 shadow-[0_0_30px_-18px_rgba(56,189,248,0.9)]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="space-y-1">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {eyebrow}
            </p>
          )}
          <h2 className="admin-display text-2xl font-semibold text-white">{title}</h2>
          {description && (
            <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}

function FieldHint({ error, hint }) {
  if (!error && !hint) return null;

  return (
    <p className={cx('px-1 text-xs', error ? 'text-rose-300' : 'text-slate-500')}>
      {error || hint}
    </p>
  );
}

function FloatingFieldFrame({
  label,
  error,
  hint,
  active,
  focused,
  className,
  children,
}) {
  return (
    <div className={cx('space-y-2', className)}>
      <div
        className={cx(
          'group relative overflow-hidden rounded-2xl border bg-slate-950/65 backdrop-blur-xl transition-all duration-300 ease-in-out',
          error
            ? 'border-rose-400/55 shadow-[0_0_0_1px_rgba(251,113,133,0.18),0_0_28px_-18px_rgba(251,113,133,0.9)]'
            : focused
            ? 'border-sky-400/55 shadow-[0_0_0_1px_rgba(56,189,248,0.22),0_0_34px_-18px_rgba(56,189,248,0.95)]'
            : 'border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/20 hover:bg-slate-950/75',
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%,rgba(56,189,248,0.08))] opacity-70" />
        {children}
        <span
          className={cx(
            'pointer-events-none absolute left-4 origin-left rounded-full px-2 text-sm font-medium transition-all duration-300 ease-in-out',
            active
              ? 'top-2.5 -translate-y-0 scale-[0.82] bg-slate-950/92 text-sky-200/90'
              : 'top-1/2 -translate-y-1/2 scale-100 bg-transparent text-slate-500',
          )}
        >
          {label}
        </span>
      </div>
      <FieldHint error={error} hint={hint} />
    </div>
  );
}

export function FloatingInput({
  label,
  error,
  hint,
  className = '',
  inputClassName = '',
  value,
  onFocus,
  onBlur,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const active = value !== undefined && value !== null && String(value).length > 0;

  return (
    <FloatingFieldFrame
      label={label}
      error={error}
      hint={hint}
      active={active || focused}
      focused={focused}
      className={className}
    >
      <input
        {...props}
        aria-label={label}
        value={value}
        placeholder=" "
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={cx(
          'relative w-full bg-transparent px-4 pb-3 pt-6 text-sm text-slate-100 placeholder-transparent outline-none',
          inputClassName,
        )}
      />
    </FloatingFieldFrame>
  );
}

export function FloatingTextarea({
  label,
  error,
  hint,
  className = '',
  textareaClassName = '',
  value,
  onFocus,
  onBlur,
  rows = 5,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const active = value !== undefined && value !== null && String(value).length > 0;

  return (
    <FloatingFieldFrame
      label={label}
      error={error}
      hint={hint}
      active={active || focused}
      focused={focused}
      className={className}
    >
      <textarea
        {...props}
        aria-label={label}
        value={value}
        rows={rows}
        placeholder=" "
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={cx(
          'relative w-full resize-none bg-transparent px-4 pb-3 pt-6 text-sm leading-6 text-slate-100 placeholder-transparent outline-none',
          textareaClassName,
        )}
      />
    </FloatingFieldFrame>
  );
}

export function FloatingSelect({
  label,
  error,
  hint,
  className = '',
  selectClassName = '',
  value,
  onFocus,
  onBlur,
  children,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const active = value !== undefined && value !== null && String(value).length > 0;

  return (
    <FloatingFieldFrame
      label={label}
      error={error}
      hint={hint}
      active={active || focused}
      focused={focused}
      className={className}
    >
      <select
        {...props}
        aria-label={label}
        value={value}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={cx(
          'relative w-full appearance-none bg-transparent px-4 pb-3 pt-6 text-sm text-slate-100 outline-none',
          selectClassName,
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
    </FloatingFieldFrame>
  );
}

export function TogglePills({ value, onChange, options, className = '' }) {
  return (
    <div className={cx('flex flex-wrap items-center gap-2', className)}>
      {options.map(({ label, value: optionValue, icon: Icon }) => {
        const active = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={cx(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out',
              active
                ? 'border-sky-400/35 bg-sky-400/14 text-white shadow-[0_0_28px_-16px_rgba(56,189,248,0.95)]'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-white',
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

const POSTER_THEMES = [
  'from-sky-400/40 via-blue-500/30 to-slate-950',
  'from-fuchsia-400/40 via-purple-500/30 to-slate-950',
  'from-emerald-400/40 via-teal-500/30 to-slate-950',
  'from-amber-300/40 via-orange-500/35 to-slate-950',
  'from-rose-400/40 via-pink-500/30 to-slate-950',
  'from-cyan-300/40 via-sky-500/30 to-slate-950',
];

function seedFromText(text = '') {
  return Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getInitials(value = '') {
  const parts = value.split(' ').filter(Boolean).slice(0, 2);
  if (!parts.length) return 'SV';
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export function PosterThumb({
  title,
  subtitle,
  imageUrl,
  type = 'movie',
  className = '',
  overlay,
}) {
  const theme = POSTER_THEMES[seedFromText(title) % POSTER_THEMES.length];
  const initials = getInitials(title);
  const typeLabel = type === 'series' ? 'Series' : 'Movie';

  return (
    <div className={cx('group/poster relative isolate overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/90 shadow-[0_24px_55px_-32px_rgba(15,23,42,0.95)]', className)}>
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/poster:scale-105" loading="lazy" />
      ) : (
        <>
          <div className={cx('absolute inset-0 bg-gradient-to-br', theme)} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.28),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.95))]" />
          <div className="absolute right-3 top-3 h-16 w-16 rounded-full border border-white/15 bg-white/10 blur-2xl" />
          <div className="absolute left-3 top-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/45 text-sm font-semibold tracking-[0.2em] text-white/90 backdrop-blur-xl">
            {initials}
          </div>
        </>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05),rgba(2,6,23,0.15)_38%,rgba(2,6,23,0.92))]" />
      <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-slate-950/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur-xl">
        {typeLabel}
      </div>
      <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3 backdrop-blur-xl">
        {subtitle && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {subtitle}
          </p>
        )}
        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-white">
          {title}
        </p>
      </div>

      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/72 opacity-0 backdrop-blur-md transition-opacity duration-300 ease-in-out group-hover/poster:opacity-100">
          {overlay}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={cx('flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center', className)}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-slate-300">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="admin-display text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
