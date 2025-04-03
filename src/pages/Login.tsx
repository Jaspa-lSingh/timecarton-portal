
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Users, DollarSign, Calendar, ShieldCheck, User } from 'lucide-react';
import AdminLoginForm from '@/components/AdminLoginForm';
import EmployeeLoginForm from '@/components/EmployeeLoginForm';
import { UserRole } from '@/types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  
  useEffect(() => {
    const checkAuth = async () => {
      // If already logged in, redirect to appropriate dashboard
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        const user = authService.getCurrentUser();
        if (user && user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user) {
          navigate('/employee/dashboard');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="bg-brand-600 text-white p-4 rounded-2xl inline-block mb-6 shadow-lg">
              <motion.svg
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
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </motion.svg>
            </div>
            <motion.h1 
              className="text-5xl font-bold text-gray-900 tracking-tight mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ShiftMaster
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-md mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Smart Scheduling & Workforce Management
            </motion.p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <motion.button
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                selectedRole === 'employee' 
                  ? 'bg-white text-blue-600 shadow-md border border-blue-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('employee')}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Employee</span>
            </motion.button>
            
            <motion.button
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                selectedRole === 'admin' 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('admin')}
            >
              <ShieldCheck className="h-5 w-5" />
              <span className="font-medium">Administrator</span>
            </motion.button>
          </div>
          
          {selectedRole === 'admin' ? <AdminLoginForm /> : <EmployeeLoginForm />}
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} ShiftMaster. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Features showcase */}
      <div className="hidden md:flex md:w-1/2 bg-brand-600 text-white flex-col items-center justify-center p-8">
        <div className="max-w-lg">
          <motion.h2 
            className="text-3xl font-bold mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Streamline Your Workforce Management
          </motion.h2>
          
          <div className="space-y-6">
            {[
              { 
                icon: <Calendar className="h-8 w-8" />, 
                title: "Smart Scheduling", 
                description: "Easily manage shifts and workforce scheduling in one place." 
              },
              { 
                icon: <Users className="h-8 w-8" />, 
                title: "Team Coordination", 
                description: "Simplify shift swaps, cover requests, and availability management." 
              },
              { 
                icon: <Clock className="h-8 w-8" />, 
                title: "Time Tracking", 
                description: "Accurate time tracking with location verification for check-ins." 
              },
              { 
                icon: <DollarSign className="h-8 w-8" />, 
                title: "Payroll Integration", 
                description: "Seamless integration with payroll systems and earnings tracking." 
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="bg-white/20 p-2 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <p className="text-white/90 mb-4">Ready to transform your workforce management?</p>
            <button className="bg-white text-brand-600 font-semibold py-3 px-6 rounded-full flex items-center mx-auto hover:bg-gray-100 transition-colors">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
