import { createElement, useEffect } from 'react';
import {
  Globe2,
  LogOut,
  MonitorPlay,
  MoonStar,
  PlayCircle,
  Settings2,
  Shield,
  Sparkles,
  SunMedium,
  UserRound,
  X,
} from 'lucide-react';
import { cx } from '../admin/utils/cx';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        'relative inline-flex h-7 w-12 items-center rounded-full border transition-all duration-300 ease-in-out',
        checked
          ? 'border-fuchsia-300/30 bg-fuchsia-300/20'
          : 'border-white/10 bg-white/[0.05]',
      )}
      aria-pressed={checked}
    >
      <span
        className={cx(
          'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ease-in-out',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}

function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-fuchsia-300">
          {createElement(Icon, { className: 'h-5 w-5' })}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function SettingsPanel({
  open,
  onClose,
  profiles,
  activeProfile,
  settings,
  onUpdateSettings,
  onOpenProfileSwitcher,
  onLogout,
  isAdmin,
  onOpenAdmin,
}) {
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

  return (
    <div className="fixed inset-0 z-[75] flex justify-end">
      <div className="absolute inset-0 bg-slate-950/76 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex h-full w-full max-w-5xl overflow-hidden border-l border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.96))] shadow-[-40px_0_120px_-56px_rgba(15,23,42,0.95)]">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
            Settings
          </p>
          <h2 className="admin-display mt-3 text-3xl font-semibold text-white">
            Playnix Controls
          </h2>
          <div className="mt-10 space-y-3">
            {[
              { label: 'Profiles', icon: UserRound },
              { label: 'Appearance', icon: Sparkles },
              { label: 'Language', icon: Globe2 },
              { label: 'Playback', icon: MonitorPlay },
              { label: 'Account', icon: Settings2 },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300"
              >
                {createElement(Icon, { className: 'h-4 w-4 text-fuchsia-300' })}
                {label}
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                Playback & Preferences
              </p>
              <h2 className="admin-display mt-3 text-3xl font-semibold text-white">
                Settings
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Manage profiles, tune the visual theme, adjust playback defaults, and control account actions.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            <SettingsCard
              icon={UserRound}
              title="Profile management"
              description="Quickly review who is watching and reopen the profile switcher for changes."
            >
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3"
                  >
                    <img src={profile.avatar} alt={profile.name} className="h-12 w-12 rounded-xl border border-white/10 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{profile.name}</p>
                      <p className="mt-1 text-xs text-slate-500 capitalize">{profile.type} profile</p>
                    </div>
                    {activeProfile?.id === profile.id && (
                      <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/12 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenProfileSwitcher();
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <UserRound className="h-4 w-4" />
                Open Profile Switcher
              </button>
            </SettingsCard>

            <SettingsCard
              icon={settings.theme === 'light' ? SunMedium : MoonStar}
              title="Appearance"
              description="Switch between the cinematic dark theme and a softer light presentation."
            >
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Dark', value: 'dark', icon: MoonStar },
                  { label: 'Light', value: 'light', icon: SunMedium },
                ].map(({ label, value, icon: Icon }) => {
                  const active = settings.theme === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onUpdateSettings({ theme: value })}
                      className={cx(
                        'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ease-in-out',
                        active
                          ? 'border-fuchsia-300/25 bg-fuchsia-300/14 text-white shadow-[0_0_24px_-16px_rgba(236,72,153,0.95)]'
                          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white',
                      )}
                    >
                      {createElement(Icon, { className: 'h-4 w-4' })}
                      {label}
                    </button>
                  );
                })}
              </div>
            </SettingsCard>

            <SettingsCard
              icon={Globe2}
              title="Language"
              description="Choose the display language used across the interface."
            >
              <select
                value={settings.language}
                onChange={(event) => onUpdateSettings({ language: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-fuchsia-400/45 focus:shadow-[0_0_28px_-16px_rgba(236,72,153,0.95)]"
              >
                {['English', 'Tamil', 'Hindi', 'Spanish'].map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </SettingsCard>

            <SettingsCard
              icon={PlayCircle}
              title="Playback defaults"
              description="Set how episodes and videos should behave during playback."
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Auto-play next episode</p>
                    <p className="mt-1 text-xs text-slate-500">Automatically continue through a series.</p>
                  </div>
                  <Toggle
                    checked={settings.autoplay}
                    onChange={(value) => onUpdateSettings({ autoplay: value })}
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3">
                  <p className="text-sm font-semibold text-white">Preferred quality</p>
                  <select
                    value={settings.quality}
                    onChange={(event) => onUpdateSettings({ quality: event.target.value })}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 ease-in-out focus:border-fuchsia-400/45"
                  >
                    {['Auto', '4K', '1080p', '720p'].map((quality) => (
                      <option key={quality} value={quality}>
                        {quality}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </SettingsCard>
          </div>

          <SettingsCard
            icon={Settings2}
            title="Account actions"
            description="Open admin tools if available, or sign out from the current session."
          >
            <div className="flex flex-wrap gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-300/12 px-5 py-3 text-sm font-semibold text-fuchsia-100 transition-all duration-300 ease-in-out hover:border-fuchsia-300/30 hover:bg-fuchsia-300/18"
                >
                  <Shield className="h-4 w-4" />
                  Open Admin
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition-all duration-300 ease-in-out hover:bg-rose-400/18"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
