import { NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Film,
  LayoutDashboard,
  LogOut,
  Shield,
  Tv,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import PlaynixLogo from '../../components/PlaynixLogo';
import { cx } from '../utils/cx';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard, accent: 'sky' },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/upload', label: 'Add Movie', icon: Film, accent: 'sky' },
      { to: '/admin/upload-series', label: 'Add Series', icon: Tv, accent: 'violet' },
      { to: '/admin/content', label: 'Library', icon: Clapperboard, accent: 'emerald' },
    ],
  },
  {
    label: 'Audience',
    items: [
      { to: '/admin/users', label: 'Accounts', icon: Users, accent: 'amber' },
    ],
  },
];

const ACTIVE_STYLES = {
  sky: {
    item: 'border-sky-400/20 bg-sky-400/15 text-white shadow-[0_0_32px_-18px_rgba(56,189,248,0.95)]',
    icon: 'border-sky-300/30 bg-sky-300/18 text-sky-200',
    glow: 'from-sky-300 via-sky-400 to-sky-500',
  },
  violet: {
    item: 'border-fuchsia-400/20 bg-fuchsia-400/14 text-white shadow-[0_0_32px_-18px_rgba(217,70,239,0.95)]',
    icon: 'border-fuchsia-300/30 bg-fuchsia-300/18 text-fuchsia-200',
    glow: 'from-fuchsia-300 via-violet-400 to-fuchsia-500',
  },
  emerald: {
    item: 'border-emerald-400/20 bg-emerald-400/12 text-white shadow-[0_0_32px_-18px_rgba(52,211,153,0.95)]',
    icon: 'border-emerald-300/30 bg-emerald-300/15 text-emerald-200',
    glow: 'from-emerald-300 via-emerald-400 to-cyan-400',
  },
  amber: {
    item: 'border-amber-300/20 bg-amber-300/12 text-white shadow-[0_0_32px_-18px_rgba(251,191,36,0.95)]',
    icon: 'border-amber-200/30 bg-amber-200/15 text-amber-100',
    glow: 'from-amber-200 via-amber-400 to-orange-400',
  },
};

function SidebarFooterButton({ collapsed, icon, label, onClick, tone = 'default' }) {
  const FooterIcon = icon;
  const toneClass = tone === 'danger'
    ? 'text-rose-300 hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-100'
    : 'text-slate-400 hover:border-white/15 hover:bg-white/[0.05] hover:text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cx(
        'flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm font-medium transition-all duration-300 ease-in-out',
        collapsed ? 'justify-center px-0' : '',
        toneClass,
      )}
    >
      <FooterIcon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const { logout } = useApp();

  return (
    <aside
      className={cx(
        'relative z-20 flex h-screen flex-col border-r border-white/10 bg-slate-950/70 backdrop-blur-2xl transition-all duration-300 ease-in-out',
        collapsed ? 'w-24' : 'w-72',
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

      <div className={cx('flex items-center border-b border-white/10 px-4 py-5', collapsed ? 'justify-center' : 'justify-between gap-3')}>
        <div className={cx('flex items-center gap-3', collapsed ? 'justify-center' : '')}>
          <PlaynixLogo size="md" showWordmark={false} />
          {!collapsed && (
            <div>
              <p className="admin-display text-base font-semibold text-white">Playnix</p>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                Admin Suite
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="px-4 pt-4">
        <div className={cx('rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl', collapsed ? 'hidden' : 'block')}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/12 text-emerald-200">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Premium Ops</p>
              <p className="text-xs text-slate-400">Catalogue, uploads, and users in one place.</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map(({ label, items }) => (
          <div key={label}>
            {!collapsed && (
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                {label}
              </p>
            )}

            <div className="space-y-2">
              {items.map(({ to, end, label: itemLabel, icon, accent }) => {
                const ItemIcon = icon;

                return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  title={collapsed ? itemLabel : undefined}
                  className={({ isActive }) => {
                    const accentStyle = ACTIVE_STYLES[accent];

                    return cx(
                      'group relative flex items-center rounded-[22px] border px-3 py-3 text-sm font-medium transition-all duration-300 ease-in-out',
                      collapsed ? 'justify-center px-0' : 'gap-3',
                      isActive
                        ? cx('border-white/10 text-white', accentStyle.item)
                        : 'border-transparent text-slate-400 hover:scale-[1.02] hover:border-white/10 hover:bg-white/[0.05] hover:text-white',
                    );
                  }}
                >
                  {({ isActive }) => {
                    const accentStyle = ACTIVE_STYLES[accent];

                    return (
                      <>
                        {isActive && (
                          <>
                            <span className={cx('absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b', accentStyle.glow)} />
                            <span className={cx('pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-r opacity-60', accent === 'sky'
                              ? 'from-sky-400/10 via-sky-400/5 to-transparent'
                              : accent === 'violet'
                              ? 'from-fuchsia-400/10 via-fuchsia-400/5 to-transparent'
                              : accent === 'emerald'
                              ? 'from-emerald-400/10 via-emerald-400/5 to-transparent'
                              : 'from-amber-300/10 via-amber-300/5 to-transparent')} />
                          </>
                        )}

                        <span
                          className={cx(
                            'relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border text-slate-400 transition-all duration-300 ease-in-out',
                            isActive
                              ? accentStyle.icon
                              : 'border-white/10 bg-white/[0.04] group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-white',
                          )}
                        >
                          <ItemIcon className="h-4 w-4" />
                        </span>

                        {!collapsed && (
                          <>
                            <span className="relative z-10 flex-1">{itemLabel}</span>
                            <ChevronRight
                              className={cx(
                                'relative z-10 h-4 w-4 transition-all duration-300 ease-in-out',
                                isActive ? 'translate-x-0 text-white/80' : 'translate-x-1 text-transparent group-hover:translate-x-0 group-hover:text-slate-500',
                              )}
                            />
                          </>
                        )}
                      </>
                    );
                  }}
                </NavLink>
              );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="space-y-1.5 rounded-[24px] border border-white/10 bg-white/[0.03] p-2 backdrop-blur-xl">
          <SidebarFooterButton
            collapsed={collapsed}
            icon={ArrowLeft}
            label="Back to Site"
            onClick={() => navigate('/')}
          />
          <SidebarFooterButton
            collapsed={collapsed}
            icon={LogOut}
            label="Sign Out"
            onClick={logout}
            tone="danger"
          />
        </div>
      </div>
    </aside>
  );
}
