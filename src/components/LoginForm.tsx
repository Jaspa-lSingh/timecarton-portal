
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { Loader2, AlertCircle, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Log the login attempt for debugging
      console.log(`Attempting to login with ${email} as ${role}`);
      
      const result = await authService.login(email, password, role);
      
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
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              Email
            </Label>
            <div className="relative">
              <Input 
                id="email"
                type="email" 
                placeholder="your.email@example.com" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                className={`w-full border-gray-300 focus:ring-brand-600 focus:border-brand-600 pl-3 ${
                  errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.email && (
                <motion.div 
                  className="text-red-500 text-xs mt-1 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.email}
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium flex items-center">
              <Lock className="w-4 h-4 mr-2 text-gray-500" />
              Password
            </Label>
            <div className="relative">
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({...errors, password: ''});
                }}
                className={`w-full border-gray-300 focus:ring-brand-600 focus:border-brand-600 ${
                  errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.password && (
                <motion.div 
                  className="text-red-500 text-xs mt-1 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.password}
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Account Type</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md border border-gray-100 transition-colors hover:bg-gray-100 cursor-pointer">
                <RadioGroupItem value="employee" id="employee" />
                <Label htmlFor="employee" className="cursor-pointer">Employee</Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md border border-gray-100 transition-colors hover:bg-gray-100 cursor-pointer">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="cursor-pointer">Administrator</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand-600 hover:bg-brand-700 transition-colors mt-6" 
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.div>
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 px-0 pt-6">
        <div className="text-center">
          <Button variant="link" asChild className="text-brand-600">
            <Link to="/register">Don't have an account? Register</Link>
          </Button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md text-sm text-center text-gray-600 border border-gray-200">
          <p className="font-medium mb-1">Demo Accounts:</p>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="bg-white p-2 rounded border border-gray-200">
              <p className="font-bold text-xs text-brand-700">Admin</p>
              <p className="text-xs">admin@example.com</p>
              <p className="text-xs">password</p>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <p className="font-bold text-xs text-brand-700">Employee</p>
              <p className="text-xs">employee@example.com</p>
              <p className="text-xs">password</p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
