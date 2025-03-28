
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'admin' | 'employee' | 'any';
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRole = 'any',
  requiredPermission
}) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Check role-specific access if required
  if (allowedRole !== 'any') {
    const hasRoleAccess = allowedRole === currentUser?.role;
    
    if (!hasRoleAccess) {
      // Show toast notification
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this page",
        variant: "destructive"
      });
      
      // Redirect based on role
      if (currentUser?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/employee/dashboard" replace />;
      }
    }
  }
  
  // Check specific permission if required
  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    // Show toast notification
    toast({
      title: "Permission Denied",
      description: "You don't have the required permissions for this action",
      variant: "destructive"
    });
    
    // Redirect based on role
    if (currentUser?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
