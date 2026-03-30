import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './admin/components/AdminLayout';

import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeriesDetails from './pages/SeriesDetails';
import WatchPage from './pages/WatchPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

import Dashboard from './admin/pages/Dashboard';
import UploadMovie from './admin/pages/UploadMovie';
import UploadSeries from './admin/pages/UploadSeries';
import ManageContent from './admin/pages/ManageContent';
import Users from './admin/pages/Users';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Main site */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/series/:id" element={<SeriesDetails />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin panel - role-gated */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/upload" element={<UploadMovie />} />
              <Route path="/admin/upload-series" element={<UploadSeries />} />
              <Route path="/admin/content" element={<ManageContent />} />
              <Route path="/admin/users" element={<Users />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
