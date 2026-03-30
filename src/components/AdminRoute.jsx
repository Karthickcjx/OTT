import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Protects all /admin/* routes.
 * - Not logged in → redirect to /login
 * - Logged in but not admin → redirect to / with a state flag for feedback
 */
export default function AdminRoute() {
  const { user, isAdmin } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location, reason: 'auth' }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" state={{ reason: 'unauthorized' }} replace />;
  }

  return <Outlet />;
}
