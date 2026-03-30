import { useEffect, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: {
    shell: 'border-emerald-300/20 bg-emerald-400/12 text-emerald-100',
    icon: 'border-emerald-300/20 bg-emerald-300/15 text-emerald-200',
    accent: 'from-emerald-300/80 via-emerald-400/30 to-transparent',
  },
  error: {
    shell: 'border-rose-300/20 bg-rose-400/12 text-rose-100',
    icon: 'border-rose-300/20 bg-rose-300/15 text-rose-200',
    accent: 'from-rose-300/80 via-rose-400/30 to-transparent',
  },
  info: {
    shell: 'border-sky-300/20 bg-sky-400/12 text-sky-100',
    icon: 'border-sky-300/20 bg-sky-300/15 text-sky-200',
    accent: 'from-sky-300/80 via-sky-400/30 to-transparent',
  },
};

export function Toast({ message, type = 'info', onDismiss }) {
  const [visible, setVisible] = useState(true);
  const Icon = ICONS[type] ?? ICONS.info;
  const style = STYLES[type] ?? STYLES.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 280);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border px-4 py-3 shadow-[0_30px_60px_-34px_rgba(2,6,23,0.95)] backdrop-blur-2xl transition-all duration-300 ease-in-out ${style.shell} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${style.accent}`} />
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border ${style.icon}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
            {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notice'}
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-white">{message}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 280);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/10 hover:text-white"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismiss(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
