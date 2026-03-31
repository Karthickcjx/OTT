import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Loader from './Loader';

/**
 * Protects routes that require authentication.
 * - Still loading auth → show loader
 * - Not logged in → redirect to /login
 */
export default function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, reason: 'auth' }} replace />;
  }

  return <Outlet />;
}
