import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clapperboard,
  Eye,
  Film,
  Sparkles,
  Tv,
  Users,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { fetchDashboardStats, fetchAdminMovies, fetchAdminSeries } from '../services/adminApi';
import {
  PosterThumb,
  SectionCard,
  SectionHeader,
} from '../components/AdminPrimitives';

const QUICK_ACTIONS = [
  {
    to: '/admin/upload',
    label: 'Upload Movie',
    description: 'Create a new feature release with premium metadata.',
    icon: Film,
    accent: 'border-sky-300/20 bg-sky-400/12 text-sky-100',
  },
  {
    to: '/admin/upload-series',
    label: 'Upload Series',
    description: 'Launch a multi-step season and episode workflow.',
    icon: Tv,
    accent: 'border-fuchsia-300/20 bg-fuchsia-400/12 text-fuchsia-100',
  },
  {
    to: '/admin/content',
    label: 'Manage Content',
    description: 'Review posters, status, and performance at a glance.',
    icon: Clapperboard,
    accent: 'border-emerald-300/20 bg-emerald-400/12 text-emerald-100',
  },
  {
    to: '/admin/users',
    label: 'View Users',
    description: 'Check role access and audience health from one view.',
    icon: Users,
    accent: 'border-amber-300/20 bg-amber-400/12 text-amber-100',
  },
];

function StatusPill({ value }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
      value === 'published'
        ? 'border-emerald-300/20 bg-emerald-400/12 text-emerald-200'
        : 'border-amber-300/20 bg-amber-400/12 text-amber-100'
    }`}>
      {value}
    </span>
  );
}

function TypePill({ value }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
      value === 'series'
        ? 'border-fuchsia-300/20 bg-fuchsia-400/12 text-fuchsia-100'
        : 'border-sky-300/20 bg-sky-400/12 text-sky-100'
    }`}>
      {value}
    </span>
  );
}

function RecentRow({ item }) {
  return (
    <div className="group flex items-center gap-4 rounded-[26px] border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05]">
      <PosterThumb
        title={item.title}
        subtitle={item.genre}
        imageUrl={item.thumbnailUrl}
        type={item.type}
        className="h-28 w-20 flex-shrink-0"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <TypePill value={item.type} />
          <StatusPill value={item.status} />
        </div>
        <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-white">{item.title}</h3>
        <p className="mt-1 text-sm text-slate-400">
          {item.genre} | {item.releaseYear}
        </p>
      </div>

      <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-600 transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:text-slate-300" />
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch stats and recent content from backend
        const [statsData, movies, series] = await Promise.all([
          fetchDashboardStats().catch(() => null),
          fetchAdminMovies().catch(() => []),
          fetchAdminSeries().catch(() => []),
        ]);

        // Build stats from response or calculate from content
        if (statsData) {
          setStats(statsData.stats || statsData);
        } else {
          setStats({
            totalMovies: movies.length,
            totalSeries: series.length,
            totalUsers: 0,
            totalViews: 0,
          });
        }

        // Build recent items
        const allContent = [
          ...(movies || []).map((m) => ({ ...m, type: m.type || 'movie' })),
          ...(series || []).map((s) => ({ ...s, type: s.type || 'series' })),
        ]
          .sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0))
          .slice(0, 5);

        setRecentItems(allContent);
      } catch (err) {
        setError(err?.friendlyMessage || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const statCards = stats ? [
    {
      label: 'Total Movies',
      value: stats.totalMovies,
      trend: 12,
      color: 'blue',
      icon: <Film className="h-5 w-5" />,
    },
    {
      label: 'Total Series',
      value: stats.totalSeries,
      trend: 33,
      color: 'violet',
      icon: <Tv className="h-5 w-5" />,
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      trend: 8,
      color: 'emerald',
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      trend: 22,
      color: 'amber',
      icon: <Eye className="h-5 w-5" />,
    },
  ] : [];

  return (
    <div className="space-y-6">
      <SectionCard className="p-6 sm:p-7">
        <SectionHeader
          icon={Sparkles}
          eyebrow="Platform Pulse"
          title="Tonight's admin overview"
          description="Track what is moving across catalogue growth, audience activity, and fresh uploads from one premium dashboard."
          action={(
            <Link
              to="/admin/content"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Open library
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        />
      </SectionCard>

      {error && (
        <div className="rounded-[26px] border border-rose-300/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="admin-skeleton h-52 rounded-[30px]" />
            ))
          : statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.9fr)]">
        <SectionCard className="p-6 sm:p-7">
          <SectionHeader
            icon={Clapperboard}
            eyebrow="Fresh Additions"
            title="Recently added releases"
            description="The newest catalogue entries ready for review, editing, or promotion."
            action={(
              <Link
                to="/admin/content"
                className="text-sm font-semibold text-sky-200 transition-colors duration-300 hover:text-white"
              >
                View all
              </Link>
            )}
          />

          <div className="mt-6 space-y-4">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="admin-skeleton h-36 rounded-[26px]" />
                ))
              : recentItems.map((item) => (
                  <RecentRow key={`${item.type}-${item.id}`} item={item} />
                ))}
          </div>
        </SectionCard>

        <SectionCard className="p-6 sm:p-7">
          <SectionHeader
            icon={Sparkles}
            eyebrow="Quick Actions"
            title="Jump into core workflows"
            description="Fast access to the pages operators use most when curating an OTT catalogue."
          />

          <div className="mt-6 space-y-3">
            {QUICK_ACTIONS.map(({ to, label, description, icon, accent }) => {
              const ActionIcon = icon;

              return (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-4 rounded-[26px] border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${accent}`}>
                    <ActionIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600 transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:text-slate-300" />
                </Link>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
