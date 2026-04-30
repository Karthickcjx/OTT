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
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(11,11,15,0.12)_35%,rgba(11,11,15,0.72))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(139,92,246,0.04),transparent_38%,rgba(251,146,60,0.035))]" />
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
