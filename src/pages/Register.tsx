
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/RegisterForm';

const Register: React.FC = () => {
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
        <h1 className="text-4xl font-bold text-gray-900">ShiftMaster</h1>
        <p className="text-lg text-gray-600 mt-2">Scheduling & Payroll Management</p>
      </div>
      
      <RegisterForm />
    </div>
  );
};

export default Register;
