
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { User } from '@/types';

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
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // Get current user and check authentication
      const isAuthenticated = await authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      console.log(`Route access: ${location.pathname} by user:`, currentUser);
      console.log(`Required role: ${allowedRole}, permission: ${requiredPermission}`);
      
      // Not authenticated, redirect to login
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        setRedirectTo('/login');
        setIsChecking(false);
        return;
      }
      
      // No user data yet, wait longer or retry
      if (!currentUser) {
        // In a real app, you might want to retry or redirect after a timeout
        setIsChecking(false);
        return;
      }
      
      // Check role-specific access if required
      if (allowedRole !== 'any') {
        const hasRoleAccess = allowedRole === currentUser.role;
        
        if (!hasRoleAccess) {
          toast({
            title: "Access Denied",
            description: `You need ${allowedRole} privileges to view this page`,
            variant: "destructive"
          });
          
          // Redirect based on role
          if (currentUser.role === 'admin') {
            setRedirectTo('/admin/dashboard');
          } else {
            setRedirectTo('/employee/dashboard');
          }
          setIsChecking(false);
          return;
        }
      }
      
      // Check specific permission if required
      if (requiredPermission && !authService.hasPermission(requiredPermission)) {
        toast({
          title: "Permission Denied",
          description: `You don't have the required "${requiredPermission}" permission for this action`,
          variant: "destructive"
        });
        
        // Redirect based on role
        if (currentUser.role === 'admin') {
          setRedirectTo('/admin/dashboard');
        } else {
          setRedirectTo('/employee/dashboard');
        }
        setIsChecking(false);
        return;
      }
      
      // All checks passed
      setIsAllowed(true);
      setIsChecking(false);
    };
    
    checkAuth();
  }, [location.pathname, allowedRole, requiredPermission]);
  
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
          <p className="text-lg text-gray-700">Loading user data...</p>
        </div>
      </div>
    );
  }
  
  if (redirectTo) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  
  return isAllowed ? <>{children}</> : null;
};

export default ProtectedRoute;
