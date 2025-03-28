
import { User, ApiResponse } from '@/types';

// Base API URL - replace with your Django backend URL when deployed
const API_URL = 'http://localhost:8000/api';

// Authentication service
export const authService = {
  // Login user
  login: async (email: string, password: string, role: 'admin' | 'employee'): Promise<ApiResponse<User>> => {
    try {
      // In a real app, this would make an API call to your Django backend
      console.log(`Attempting to login with ${email} as ${role}`);
      
      // Mock login for now - will be replaced with actual API call
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email === 'admin@example.com' && password === 'password' && role === 'admin') {
        const userData: User = {
          id: '1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          position: 'Manager',
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        return { data: userData };
      } 
      else if (email === 'employee@example.com' && password === 'password' && role === 'employee') {
        const userData: User = {
          id: '2',
          email: 'employee@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'employee',
          position: 'Staff',
          hourlyRate: 15.5,
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        return { data: userData };
      }
      
      return { error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'An unexpected error occurred' };
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('user');
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
  
  // Register user (for future implementation)
  register: async (userData: Partial<User>, password: string): Promise<ApiResponse<User>> => {
    try {
      // This would make an API call to register a user in your Django backend
      console.log('Register user:', userData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response - will be replaced with actual API call
      return { message: 'Registration feature coming soon!' };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'An unexpected error occurred' };
    }
  }
};
