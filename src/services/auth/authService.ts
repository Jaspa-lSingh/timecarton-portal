
import { User } from '@/types';
import { supabase, isAuthenticated } from '@/lib/supabase';
import { AuthResponse, authState, SUPER_ADMIN } from './authTypes';
import { userService } from './userService';
import { tokenService } from './tokenService';

// Authentication service methods
export const authService = {
  // Register a new user
  async register(email: string, password: string, userData: Partial<User>): Promise<AuthResponse> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);
      
      if (authData.user) {
        // Add user profile data to the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              role: userData.role || 'employee',
              // Add other user fields as needed
            },
          ]);

        if (profileError) throw new Error(profileError.message);
      }

      return { data: authData, message: 'Registration successful' };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: error instanceof Error ? error.message : 'Registration failed' };
    }
  },

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Check for super admin credentials first
      if (email === SUPER_ADMIN.email && password === SUPER_ADMIN.password) {
        // Create a super admin user session
        const superAdminUser: User = {
          id: SUPER_ADMIN.id,
          email: SUPER_ADMIN.email,
          firstName: SUPER_ADMIN.firstName,
          lastName: SUPER_ADMIN.lastName,
          role: SUPER_ADMIN.role,
          position: SUPER_ADMIN.position,
        };
        
        // Update cache
        authState.currentUserCache = superAdminUser;
        // Set a token (not a real token, just a marker)
        authState.currentTokenCache = `super_admin_${Date.now()}`;
        
        // Store super admin session flag
        localStorage.setItem('superAdminSession', 'true');
        
        return { 
          data: superAdminUser, 
          message: 'Super admin login successful' 
        };
      }
      
      // Regular login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      // Get user data from the users table
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) throw new Error(userError.message);

        // Create user object
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          role: userData.role || 'employee',
          position: userData.position,
          phoneNumber: userData.phone_number,
          employeeId: userData.employee_id,
          department: userData.department,
          hourlyRate: userData.hourly_rate,
          avatar: userData.avatar_url,
        };

        // Update cache
        authState.currentUserCache = user;
        // Cache the token
        authState.currentTokenCache = data.session?.access_token || null;

        // Clear any super admin session flag
        localStorage.removeItem('superAdminSession');

        return { data: user };
      }

      return { data: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      // If the current user is the super admin, just clear the cache
      if (authState.currentUserCache?.id === SUPER_ADMIN.id) {
        authState.currentUserCache = null;
        authState.currentTokenCache = null;
        localStorage.removeItem('superAdminSession');
        return { data: true };
      }
      
      // Normal logout through Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw new Error(error.message);

      // Clear cache
      authState.currentUserCache = null;
      authState.currentTokenCache = null;

      return { data: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: error instanceof Error ? error.message : 'Logout failed' };
    }
  },

  // Re-export user service methods
  getCurrentUser: userService.getCurrentUser,
  isAdmin: userService.isAdmin,
  hasPermission: userService.hasPermission,
  updateProfile: userService.updateProfile,

  // Re-export token service methods
  getToken: tokenService.getToken,

  // Check if the user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    // Check for super admin session
    if (localStorage.getItem('superAdminSession') === 'true') {
      return true;
    }
    
    // Normal authentication check
    return await isAuthenticated();
  },
};
