
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/RegisterForm';
import { authService } from '@/services/authService';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page if not authorized
    const checkAuth = async () => {
      const isAuth = await authService.isAuthenticated();
      const user = authService.getCurrentUser();
      
      if (!isAuth || (user && user.role !== 'admin')) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <div className="bg-brand-600 text-white p-2 rounded-lg inline-block mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
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
        <h1 className="text-4xl font-bold text-gray-900">ShiftWise</h1>
        <p className="text-lg text-gray-600 mt-2">Employee Management</p>
      </div>
      
      <RegisterForm adminCreated={true} />
    </div>
  );
};

export default Register;
