import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user) {
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(user.role)) {
        return <Navigate to="/" replace />;
      }
    } else if (user.role !== requiredRole) {
      return <Navigate to="/" replace />; // Redirect to dashboard if not authorized
    }
  }

  return children;
}
