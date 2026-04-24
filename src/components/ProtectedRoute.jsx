import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth.js';

export default function ProtectedRoute({ children, role }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && !isAdmin()) {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}