import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  PauseCircle,
  Search,
  ShieldPlus,
  Trash2,
  UserRound,
} from 'lucide-react';
import { fetchUsers, deleteUser } from '../services/adminApi';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import {
  SectionCard,
  SectionHeader,
  TogglePills,
} from '../components/AdminPrimitives';
import { cx } from '../utils/cx';

function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
      role === 'admin' || role === 'ADMIN'
        ? 'border-fuchsia-300/20 bg-fuchsia-400/12 text-fuchsia-100'
        : 'border-sky-300/20 bg-sky-400/12 text-sky-100'
    }`}>
      {role}
    </span>
  );
}

function getAvatarDataUri(name, role) {
  const palette = role === 'admin' || role === 'ADMIN'
    ? { start: '#a855f7', end: '#7c3aed', accent: '#f5d0fe' }
    : { start: '#38bdf8', end: '#2563eb', accent: '#dbeafe' };

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.start}" />
          <stop offset="100%" stop-color="${palette.end}" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="28" fill="url(#g)" />
      <circle cx="76" cy="20" r="10" fill="rgba(255,255,255,0.2)" />
      <text x="48" y="56" text-anchor="middle" font-family="Sora, Arial, sans-serif" font-size="30" font-weight="700" fill="${palette.accent}">
        ${initials || 'SV'}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function Users() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data || []);
      } catch (err) {
        setError(err?.friendlyMessage || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const query = deferredSearch.toLowerCase();
      const matchSearch = !deferredSearch
        || user.name?.toLowerCase().includes(query)
        || user.email?.toLowerCase().includes(query);
      const userRole = (user.role || '').toLowerCase();
      const matchRole = !roleFilter || userRole === roleFilter;
      return matchSearch && matchRole;
    });
  }, [deferredSearch, roleFilter, users]);

  const handleDelete = async (id) => {
    if (!confirm('Remove this user?')) return;

    try {
      await deleteUser(id);
      setUsers((current) => current.filter((user) => user.id !== id));
      toast.success('User removed');
    } catch {
      toast.error('Failed to remove user');
    }
  };

  const handlePromote = (user) => {
    toast.info(`Promote ${user.name} when the backend action is connected`);
  };

  const handleSuspend = (user) => {
    toast.info(`Suspend ${user.name} when the moderation workflow is connected`);
  };

  return (
    <>
      <div className="space-y-6">
        <SectionCard className="p-6 sm:p-7">
          <SectionHeader
            icon={UserRound}
            eyebrow="Audience Access"
            title="User management"
            description="Review operators and viewers with clearer hierarchy, richer avatars, and quick moderation actions."
          />

          {error && (
            <div className="mt-4 rounded-[22px] border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
              <div className="space-y-4">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/65 py-3 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 ease-in-out placeholder:text-slate-600 focus:border-sky-400/45 focus:shadow-[0_0_28px_-16px_rgba(56,189,248,0.95)]"
                  />
                </label>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Role filters
                  </p>
                  <div className="mt-3">
                    <TogglePills
                      value={roleFilter}
                      onChange={setRoleFilter}
                      options={[
                        { label: 'All Roles', value: '', icon: UserRound },
                        { label: 'Users', value: 'user', icon: UserRound },
                        { label: 'Admins', value: 'admin', icon: ShieldPlus },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <SectionCard className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Visible accounts
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{filtered.length}</p>
                <p className="mt-1 text-sm text-slate-400">of {users.length} total users</p>
              </SectionCard>

              <SectionCard className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Admin accounts
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {users.filter((user) => (user.role || '').toLowerCase() === 'admin').length}
                </p>
                <p className="mt-1 text-sm text-slate-400">currently holding elevated access</p>
              </SectionCard>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="admin-skeleton h-28 rounded-[28px]" />
            ))
          ) : (
            filtered.map((user) => (
              <SectionCard key={user.id} className="p-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <img
                      src={getAvatarDataUri(user.name || 'User', user.role)}
                      alt={user.name}
                      className="h-16 w-16 rounded-[24px] border border-white/10 object-cover shadow-[0_18px_40px_-24px_rgba(15,23,42,0.95)]"
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="line-clamp-1 text-lg font-semibold text-white">{user.name}</h3>
                        <RoleBadge role={user.role} />
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-400">{user.email}</p>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        {user.joinedAt && (
                          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
                            Joined {new Date(user.joinedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        )}
                        {user.watchlistCount !== undefined && (
                          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
                            Watchlist {user.watchlistCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {(user.role || '').toLowerCase() !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => handlePromote(user)}
                        className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/12 px-4 py-2.5 text-sm font-semibold text-fuchsia-100 transition-all duration-300 ease-in-out hover:border-fuchsia-300/30 hover:bg-fuchsia-400/18"
                      >
                        <ShieldPlus className="h-4 w-4" />
                        Promote
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSuspend(user)}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/12 px-4 py-2.5 text-sm font-semibold text-amber-100 transition-all duration-300 ease-in-out hover:border-amber-300/30 hover:bg-amber-400/18"
                    >
                      <PauseCircle className="h-4 w-4" />
                      Suspend
                    </button>

                    {(user.role || '').toLowerCase() !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition-all duration-300 ease-in-out hover:bg-rose-400/18"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    )}

                    {(user.role || '').toLowerCase() === 'admin' && (
                      <span className={cx(
                        'rounded-full border px-4 py-2.5 text-sm font-semibold',
                        'border-fuchsia-300/20 bg-fuchsia-400/12 text-fuchsia-100',
                      )}>
                        Elevated access
                      </span>
                    )}
                  </div>
                </div>
              </SectionCard>
            ))
          )}
        </div>
      </div>

      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </>
  );
}
