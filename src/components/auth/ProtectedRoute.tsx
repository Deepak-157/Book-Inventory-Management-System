import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../common/Spinner';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

/**
 * Component to protect routes that require authentication
 * Optionally restricts access by user role
 */
const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement if specified
  if (requiredRole) {
    // For debugging
    console.log('Required role:', requiredRole);
    console.log('User role:', user?.role);
    console.log('Has required role:', hasRole(requiredRole));
    
    // Check if user has ADMIN role (admins can access any role-restricted route)
    const isAdmin = user?.role === UserRole.ADMIN;
    
    // If user is not admin and doesn't have the required role, redirect to unauthorized
    if (!isAdmin && !hasRole(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;