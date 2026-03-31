import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Loader from './Loader';

/**
 * Protects all /admin/* routes.
 * - Auth still loading → show loader
 * - Not logged in → redirect to /login
 * - Logged in but not admin → redirect to / with a state flag for feedback
 */
export default function AdminRoute() {
  const { user, isAdmin, isAuthenticated, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) return <Loader />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location, reason: 'auth' }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" state={{ reason: 'unauthorized' }} replace />;
  }

  return <Outlet />;
}
