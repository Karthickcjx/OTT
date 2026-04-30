import { useId } from 'react';
import { cx } from '../admin/utils/cx';

const ICON_SIZES = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
};

const WORDMARK_SIZES = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export default function PlaynixLogo({
  size = 'md',
  showWordmark = true,
  tagline = false,
  className = '',
}) {
  const safeId = useId().replace(/:/g, '');
  const gradientId = `playnix-gradient-${safeId}`;
  const glowId = `playnix-glow-${safeId}`;

  return (
    <span className={cx('inline-flex items-center gap-3', className)}>
      <svg
        className={cx('flex-shrink-0 drop-shadow-[0_0_18px_rgba(236,72,153,0.35)]', ICON_SIZES[size] || ICON_SIZES.md)}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Playnix"
      >
        <defs>
          <linearGradient id={gradientId} x1="7" y1="9" x2="57" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="48%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.72 0 1 0 0 0.18 0 0 1 0 0.55 0 0 0 0.55 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          filter={`url(#${glowId})`}
          fill={`url(#${gradientId})`}
          d="M16 8h24.5C52 8 60 15.8 60 27.1S52 46 40.5 46H29v6.7A7.3 7.3 0 0 1 21.7 60H16V8Z"
        />
        <path
          fill={`url(#${gradientId})`}
          d="M16 43.5c5.7-8.2 12.7-12.3 21-12.3h5.1V46H30.7c-6.2 0-10.4 2.9-14.7 9.4V43.5Z"
          opacity="0.92"
        />
        <path
          fill="#0b0b0f"
          d="M31 22.8c0-1.9 2.1-3.1 3.7-2l14.5 8.9c1.5.9 1.5 3.2 0 4.1l-14.5 8.9c-1.6 1-3.7-.2-3.7-2V22.8Z"
        />
      </svg>

      {showWordmark && (
        <span className="min-w-0 leading-none">
          <span className={cx('font-black tracking-normal text-white', WORDMARK_SIZES[size] || WORDMARK_SIZES.md)}>
            Play<span className="playnix-gradient-text">nix</span>
          </span>
          {tagline && (
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
              Watch. Play. Enjoy.
            </span>
          )}
        </span>
      )}
    </span>
  );
}
