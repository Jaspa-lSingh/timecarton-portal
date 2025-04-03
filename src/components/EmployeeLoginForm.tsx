
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeeLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await authService.login(email, password);
      
      if (result.error) {
        toast({
          title: 'Login Failed',
          description: result.error,
          variant: 'destructive'
        });
      } else if (result.data) {
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${result.data.firstName}!`
        });
        
        // Redirect based on role
        if (result.data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="inline-block p-3 rounded-full bg-blue-50 mb-3">
          <User className="h-6 w-6 text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Employee Login</h2>
        <p className="text-gray-500 mt-1">Access your schedule and timesheet</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="employee-email" className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            Email
          </Label>
          <Input 
            id="employee-email"
            type="email" 
            placeholder="your.email@example.com" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({...errors, email: ''});
            }}
            className={`w-full focus:ring-brand-500 focus:border-brand-500 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employee-password" className="text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            Password
          </Label>
          <Input 
            id="employee-password"
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({...errors, password: ''});
            }}
            className={`w-full focus:ring-brand-500 focus:border-brand-500 ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-employee"
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-employee" className="ml-2 block text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-brand-600 hover:text-brand-500">
              Forgot password?
            </a>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-brand-600 hover:from-blue-600 hover:to-brand-700 text-white py-2 px-4 rounded-md transition-all flex items-center justify-center gap-2" 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Contact your administrator if you need access</p>
      </div>
    </motion.div>
  );
};

export default EmployeeLoginForm;
