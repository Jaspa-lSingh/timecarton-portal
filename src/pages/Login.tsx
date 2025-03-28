
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import LoginForm from '@/components/LoginForm';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already logged in, redirect to appropriate dashboard
    const user = authService.getCurrentUser();
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mb-8 text-center">
        <div className="bg-brand-600 text-white p-4 rounded-2xl inline-block mb-6 shadow-lg">
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
            className="animate-pulse"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-2">ShiftMaster</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">Streamlined Scheduling & Payroll Management</p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Log In</h2>
        <LoginForm />
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} ShiftMaster. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
