import { useEffect, useState } from 'react';
import { Plus, Settings2, Shield, Sparkles, X } from 'lucide-react';
import { cx } from '../admin/utils/cx';

function ProfileTypePill({ active, label, onClick, tone = 'adult' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out',
        active
          ? tone === 'kids'
            ? 'border-amber-300/30 bg-amber-300/16 text-white shadow-[0_0_24px_-16px_rgba(251,191,36,0.95)]'
            : 'border-sky-300/30 bg-sky-300/16 text-white shadow-[0_0_24px_-16px_rgba(56,189,248,0.95)]'
          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white',
      )}
    >
      {label}
    </button>
  );
}

export default function ProfileSwitcherModal({
  open,
  profiles,
  activeProfileId,
  onClose,
  onSwitchProfile,
  onAddProfile,
  onOpenSettings,
  onLogout,
  isAdmin,
  onOpenAdmin,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('adult');

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  const submitProfile = () => {
    if (!name.trim()) return;
    onAddProfile({ name: name.trim(), type });
    setName('');
    setType('adult');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-slate-950/82 backdrop-blur-xl" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(2,6,23,0.96),rgba(30,41,59,0.88),rgba(88,28,135,0.72))] shadow-[0_50px_120px_-48px_rgba(15,23,42,0.96)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%)]" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                Profile Selection
              </p>
              <h2 className="admin-display mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Who&apos;s watching?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Switch between adult and kids profiles instantly, or create a new viewer space without leaving the stream.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              aria-label="Close profile switcher"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {profiles.map((profile) => {
              const active = profile.id === activeProfileId;

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => {
                    onSwitchProfile(profile.id);
                    onClose();
                  }}
                  className={cx(
                    'group rounded-[30px] border p-5 text-left transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02]',
                    active
                      ? 'border-sky-300/30 bg-white/[0.07] shadow-[0_0_40px_-20px_rgba(56,189,248,0.95)]'
                      : 'border-white/10 bg-white/[0.04] hover:border-white/18 hover:bg-white/[0.06]',
                  )}
                >
                  <div className="relative mx-auto w-fit">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-28 w-28 rounded-[32px] border border-white/10 object-cover shadow-[0_24px_40px_-30px_rgba(15,23,42,0.95)] transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <span className={cx(
                      'absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]',
                      profile.type === 'kids'
                        ? 'border-amber-300/30 bg-amber-300/16 text-amber-50'
                        : 'border-sky-300/30 bg-sky-300/16 text-sky-50',
                    )}>
                      {profile.type}
                    </span>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-lg font-semibold text-white">{profile.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {profile.type === 'kids' ? 'Curated kids-safe catalogue' : 'Full streaming catalogue'}
                    </p>
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsAdding((value) => !value)}
              className="group rounded-[30px] border border-dashed border-white/12 bg-white/[0.03] p-5 text-left transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.05] text-slate-300 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-white/[0.08] group-hover:text-white">
                <Plus className="h-8 w-8" />
              </div>
              <div className="mt-6 text-center">
                <p className="text-lg font-semibold text-white">Add Profile</p>
                <p className="mt-1 text-sm text-slate-400">
                  Create an adult or kids space in seconds.
                </p>
              </div>
            </button>
          </div>

          {isAdding && (
            <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="space-y-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      New Profile
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Give the profile a name and decide whether it should use the kids-safe experience.
                    </p>
                  </div>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter profile name"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out placeholder:text-slate-600 focus:border-sky-400/45 focus:shadow-[0_0_28px_-16px_rgba(56,189,248,0.95)]"
                  />

                  <div className="flex flex-wrap gap-2">
                    <ProfileTypePill active={type === 'adult'} label="Adult Profile" onClick={() => setType('adult')} />
                    <ProfileTypePill active={type === 'kids'} label="Kids Profile" tone="kids" onClick={() => setType('kids')} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={submitProfile}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-300/20 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_44px_-24px_rgba(59,130,246,0.95)] transition-all duration-300 ease-in-out hover:-translate-y-0.5"
                >
                  <Sparkles className="h-4 w-4" />
                  Save Profile
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/12 px-5 py-3 text-sm font-semibold text-sky-100 transition-all duration-300 ease-in-out hover:border-sky-300/30 hover:bg-sky-300/18"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="rounded-full border border-rose-300/20 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition-all duration-300 ease-in-out hover:bg-rose-400/18"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
