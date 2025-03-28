
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'admin' | 'employee' | 'any';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRole = 'any' 
}) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // If role-specific access is required
  if (allowedRole !== 'any') {
    const hasAccess = allowedRole === currentUser?.role;
    
    if (!hasAccess) {
      // Redirect based on role
      if (currentUser?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/employee/dashboard" replace />;
      }
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
