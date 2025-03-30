
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Check if user is already logged in
      const isAuthenticated = await authService.isAuthenticated();
      
      // Add a slight delay for a better UX
      setTimeout(() => {
        setIsLoading(false);
        
        if (isAuthenticated) {
          const currentUser = authService.getCurrentUser();
          
          // Redirect based on role
          if (currentUser && currentUser.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/employee/dashboard');
          }
        } else {
          // Redirect to login if not logged in
          navigate('/login');
        }
      }, 1500);
    };
    
    checkAuthAndRedirect();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">ShiftMaster</h1>
          <p className="text-xl text-gray-600">Streamlined Scheduling & Payroll Management</p>
          <div className="mt-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-brand-600 animate-spin mr-2" />
            <span className="text-lg text-gray-700">Redirecting...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
