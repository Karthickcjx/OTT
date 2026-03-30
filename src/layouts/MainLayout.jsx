import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { cx } from '../admin/utils/cx';

export default function MainLayout() {
  const { isKidsMode, settings } = useApp();
  const isLight = settings.theme === 'light' && !isKidsMode;

  useEffect(() => {
    document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';

    return () => {
      document.documentElement.style.colorScheme = 'dark';
    };
  }, [isLight]);

  return (
    <div
      className={cx(
        'stream-shell flex min-h-screen flex-col',
        isKidsMode && 'stream-shell-kids',
        isLight && 'theme-light stream-shell-light',
        !isKidsMode && !isLight && 'stream-shell-dark',
      )}
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0),rgba(2,6,23,0.24)_55%,rgba(2,6,23,0.5))]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
