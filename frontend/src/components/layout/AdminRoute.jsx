import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullPageSpinner } from '../ui/LoadingSpinner';

export default function AdminRoute({ children }) {
  const { isModerator, isAuthenticated, loading } = useAuth();
  if (loading)          return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isModerator)     return <Navigate to="/dashboard" replace />;
  return children;
}
