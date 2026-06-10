import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Layout from './components/shared/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import RafflesListPage from './pages/raffles/RafflesListPage';
import RaffleDetailPage from './pages/raffles/RaffleDetailPage';
import CreateRafflePage from './pages/raffles/CreateRafflePage';
import EditRafflePage from './pages/raffles/EditRafflePage';
import StatsPage from './pages/stats/StatsPage';
import RankingPage from './pages/ranking/RankingPage';
import SimulatorPage from './pages/simulator/SimulatorPage';
import ProfilePage from './pages/profile/ProfilePage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/raffles" element={<PrivateRoute><RafflesListPage /></PrivateRoute>} />
      <Route path="/raffles/new" element={<PrivateRoute><CreateRafflePage /></PrivateRoute>} />
      <Route path="/raffles/:id/edit" element={<PrivateRoute><EditRafflePage /></PrivateRoute>} />
      <Route path="/raffles/:id" element={<PrivateRoute><RaffleDetailPage /></PrivateRoute>} />
      <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} />
      <Route path="/ranking" element={<PrivateRoute><RankingPage /></PrivateRoute>} />
      <Route path="/simulator" element={<PrivateRoute><SimulatorPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
