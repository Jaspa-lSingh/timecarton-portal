
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <Card className="w-full max-w-md mx-auto p-6 shadow-lg border-t-4 border-t-brand-600 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
        <CardDescription className="text-gray-500">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="your.email@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-300 focus:ring-brand-600 focus:border-brand-600"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 focus:ring-brand-600 focus:border-brand-600"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Account Type</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employee" id="employee" />
                <Label htmlFor="employee" className="cursor-pointer">Employee</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="cursor-pointer">Administrator</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand-600 hover:bg-brand-700 transition-colors" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
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
