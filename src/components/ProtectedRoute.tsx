
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  
  useEffect(() => {
    // Log route access for debugging
    console.log(`Route access: ${location.pathname} by user:`, currentUser);
    console.log(`Required role: ${allowedRole}, permission: ${requiredPermission}`);
  }, [location.pathname, currentUser, allowedRole, requiredPermission]);
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Show toast notification
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page",
      variant: "destructive"
    });
    
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Check if current user data is available
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
          <p className="text-lg text-gray-700">Loading user data...</p>
        </div>
      </div>
    );
  }
  
  // Check role-specific access if required
  if (allowedRole !== 'any') {
    const hasRoleAccess = allowedRole === currentUser.role;
    
    if (!hasRoleAccess) {
      // Show toast notification
      toast({
        title: "Access Denied",
        description: `You need ${allowedRole} privileges to view this page`,
        variant: "destructive"
      });
      
      // Redirect based on role
      if (currentUser.role === 'admin') {
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
      description: `You don't have the required "${requiredPermission}" permission for this action`,
      variant: "destructive"
    });
    
    // Redirect based on role
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
