import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-10 px-6 md:px-12 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <span className="text-white font-bold">StreamVault</span>
            </div>
            <p className="text-gray-600 text-xs max-w-xs leading-relaxed">
              Your gateway to the best in cinema. Stream movies anytime, anywhere.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Navigate</p>
              <ul className="space-y-2">
                {[{ to: '/', label: 'Home' }, { to: '/profile', label: 'My List' }].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-gray-600 hover:text-gray-300 text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Account</p>
              <ul className="space-y-2">
                {[{ to: '/login', label: 'Sign In' }, { to: '/signup', label: 'Sign Up' }].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-gray-600 hover:text-gray-300 text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-700 text-xs">© 2025 StreamVault. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Powered by TMDB API</p>
        </div>
      </div>
    </footer>
  );
}
