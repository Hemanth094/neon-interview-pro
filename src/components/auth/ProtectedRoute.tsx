// Role-based route protection
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { UserRole } from '@/store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Show loading while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if roles specified
  if (allowedRoles.length > 0) {
    const userRole = user?.unsafeMetadata?.role as UserRole;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect based on user role
      if (userRole === 'candidate') {
        return <Navigate to="/interview" replace />;
      } else if (userRole === 'interviewer') {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;