import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_META = {
  '/admin': {
    title: 'Dashboard',
    description: 'A cinematic overview of catalogue health, uploads, and audience momentum.',
  },
  '/admin/upload': {
    title: 'Upload Movie',
    description: 'Prepare new releases with premium metadata, artwork, and media uploads.',
  },
  '/admin/upload-series': {
    title: 'Upload Series',
    description: 'Build a full series release flow from master info to seasons and episode delivery.',
  },
  '/admin/content': {
    title: 'Manage Content',
    description: 'Review publishing status, catalogue details, and performance across movies and series.',
  },
  '/admin/movies': {
    title: 'Manage Movies',
    description: 'Curate standalone releases with polished metadata and lifecycle control.',
  },
  '/admin/users': {
    title: 'Users',
    description: 'Monitor accounts, roles, and engagement with a clearer operations view.',
  },
};

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? {
    title: 'Admin',
    description: 'Streaming platform operations console.',
  };

  return (
    <div className="admin-shell flex min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar title={meta.title} description={meta.description} />

        <main className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6 lg:px-8">
          <div key={pathname} className="mx-auto w-full max-w-7xl animate-[admin-page-enter_420ms_ease-out]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
