
import { User, ApiResponse, UserRole } from '@/types';

// Base API URL - replace with your Django backend URL when deployed
const API_URL = 'http://localhost:8000/api';

// Authentication service
export const authService = {
  // Login user
  login: async (email: string, password: string, role: UserRole): Promise<ApiResponse<User>> => {
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
        localStorage.setItem('token', 'mock-jwt-token-for-admin');
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
        localStorage.setItem('token', 'mock-jwt-token-for-employee');
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
    localStorage.removeItem('token');
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
    return !!localStorage.getItem('token');
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
  
  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  // Register user
  register: async (userData: Partial<User>, password: string): Promise<ApiResponse<User>> => {
    try {
      // This would make an API call to register a user in your Django backend
      console.log('Register user:', userData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock registration response
      const newUser: User = {
        id: `${Date.now()}`,
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: userData.role || 'employee',
        position: userData.position,
        hourlyRate: userData.hourlyRate,
        phoneNumber: userData.phoneNumber,
      };
      
      return { data: newUser, message: 'User registered successfully!' };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'An unexpected error occurred' };
    }
  },
  
  // Update user profile
  updateProfile: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      console.log('Update profile for user:', userId, userData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        return { error: 'User not authenticated' };
      }
      
      // Update user data
      const updatedUser: User = {
        ...currentUser,
        ...userData,
      };
      
      // Save updated user to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { data: updatedUser, message: 'Profile updated successfully!' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: 'An unexpected error occurred' };
    }
  },
  
  // Check permissions
  hasPermission: (permission: string): boolean => {
    const user = authService.getCurrentUser();
    
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // For employee, check specific permissions
    // In a real app, this would check against a list of permissions from the backend
    const employeePermissions = [
      'view_own_schedule',
      'view_own_timesheet',
      'view_own_payroll',
      'update_own_profile',
      'clock_in_out',
    ];
    
    return employeePermissions.includes(permission);
  }
};
