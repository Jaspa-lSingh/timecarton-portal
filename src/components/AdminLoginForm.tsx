
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Lock, AlertCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLoginForm: React.FC = () => {
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
      className="bg-slate-900 rounded-xl p-7 shadow-xl border border-slate-800 w-full max-w-md text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="inline-block p-3 rounded-full bg-brand-600 mb-3">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Administrator Access</h2>
        <p className="text-slate-400 mt-1">Manage your organization</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="text-sm font-medium text-slate-300">
            Admin Email
          </Label>
          <div className="relative">
            <Input 
              id="admin-email"
              type="email" 
              placeholder="admin@company.com" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: ''});
              }}
              className={`w-full bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-brand-500 focus:border-brand-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
              >
                <AlertCircle className="h-5 w-5" />
              </motion.div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.email}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="admin-password" className="text-sm font-medium text-slate-300">
            Password
          </Label>
          <div className="relative">
            <Input 
              id="admin-password"
              type="password" 
              placeholder="Enter your secure password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({...errors, password: ''});
              }}
              className={`w-full bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-brand-500 focus:border-brand-500 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
              >
                <AlertCircle className="h-5 w-5" />
              </motion.div>
            )}
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.password}
            </p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-admin"
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-700 rounded bg-slate-800"
            />
            <label htmlFor="remember-admin" className="ml-2 block text-sm text-slate-400">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-brand-400 hover:text-brand-300">
              Reset credentials
            </a>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit" 
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 px-4 rounded-md transition-all flex items-center justify-center gap-2" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Lock className="h-4 w-4" /> Secure Sign In
              </>
            )}
          </Button>
        </motion.div>
        
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-900 text-slate-400">Security notice</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-green-400" />
            <span>This login grants administrative privileges</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-green-400" />
            <span>Secure encryption for all login data</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminLoginForm;
