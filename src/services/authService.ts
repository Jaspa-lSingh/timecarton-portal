import { User } from '@/types';
import { supabase, isAuthenticated } from '@/lib/supabase';

// Types for service responses
export interface AuthResponse {
  data?: any;
  error?: string;
  message?: string;
}

// Cache the current user to avoid repeated calls to getUser
let currentUserCache: User | null = null;
// Cache the access token
let currentTokenCache: string | null = null;

// Super Admin credentials
const SUPER_ADMIN = {
  id: '875626',
  email: 'jskamboj521@gmail.com',
  password: 'Kam@8756',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin' as const,
  position: 'Super Administrator',
};

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
        currentUserCache = superAdminUser;
        // Set a token (not a real token, just a marker)
        currentTokenCache = `super_admin_${Date.now()}`;
        
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
        currentUserCache = user;
        // Cache the token
        currentTokenCache = data.session?.access_token || null;

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
      if (currentUserCache?.id === SUPER_ADMIN.id) {
        currentUserCache = null;
        currentTokenCache = null;
        return { data: true };
      }
      
      // Normal logout through Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw new Error(error.message);

      // Clear cache
      currentUserCache = null;
      currentTokenCache = null;

      return { data: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: error instanceof Error ? error.message : 'Logout failed' };
    }
  },

  // Get current user - returns a User object, not a Promise<AuthResponse>
  getCurrentUser(): User | null {
    // Return from cache if available
    if (currentUserCache) return currentUserCache;
    
    // Check if we have a super admin session in localStorage
    const isSuperAdminSession = localStorage.getItem('superAdminSession') === 'true';
    if (isSuperAdminSession) {
      const superAdminUser: User = {
        id: SUPER_ADMIN.id,
        email: SUPER_ADMIN.email,
        firstName: SUPER_ADMIN.firstName,
        lastName: SUPER_ADMIN.lastName,
        role: SUPER_ADMIN.role,
        position: SUPER_ADMIN.position,
      };
      currentUserCache = superAdminUser;
      return superAdminUser;
    }

    // Otherwise get from session
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) return null;

        // Get additional user data from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) return null;

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
        currentUserCache = user;

        // Get and cache the token
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          currentTokenCache = sessionData.session.access_token;
        }
        
        return user;
      } catch (error) {
        console.error('Get current user error:', error);
        return null;
      }
    };

    // Start the async operation but return null synchronously
    getUser();
    return null;
  },

  // Check if the user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    // Check for super admin session
    if (localStorage.getItem('superAdminSession') === 'true') {
      return true;
    }
    
    // Normal authentication check
    return await isAuthenticated();
  },
  
  // Check if current user is admin
  isAdmin(): boolean {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
  
  // Check if user has a specific permission
  hasPermission(permission: string): boolean {
    // Simplified permission check - in a real app this would be more sophisticated
    const user = authService.getCurrentUser();
    
    // Admin has all permissions
    if (user?.role === 'admin') return true;
    
    // For employees, check specific permissions
    // This is a placeholder for a more complex permission system
    const employeePermissions: Record<string, string[]> = {
      'view_own_schedule': ['employee'],
      'view_own_timesheet': ['employee'],
      'view_own_payroll': ['employee'],
      'update_own_profile': ['employee'],
    };
    
    return user ? employeePermissions[permission]?.includes(user.role) || false : false;
  },

  // Function to update user profile
  async updateProfile(userId: string, userData: Partial<User>): Promise<AuthResponse> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          position: userData.position,
          phone_number: userData.phoneNumber,
          // Add other updatable fields
        })
        .eq('id', userId);

      if (error) throw new Error(error.message);

      // Update cache if the current user is being updated
      if (currentUserCache && currentUserCache.id === userId) {
        currentUserCache = {
          ...currentUserCache,
          firstName: userData.firstName || currentUserCache.firstName,
          lastName: userData.lastName || currentUserCache.lastName,
          position: userData.position || currentUserCache.position,
          phoneNumber: userData.phoneNumber || currentUserCache.phoneNumber,
        };
      }

      return { data: currentUserCache, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  },

  // Get authentication token for API requests
  getToken(): string | null {
    // For super admin, we use a special token
    if (currentUserCache?.id === SUPER_ADMIN.id) {
      return currentTokenCache || `super_admin_${Date.now()}`;
    }
    
    if (currentTokenCache) return currentTokenCache;
    
    // If not in cache, try to get it asynchronously
    const getTokenAsync = async (): Promise<string | null> => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting token:', error);
          return null;
        }
        
        const token = data.session?.access_token || null;
        // Cache the token
        currentTokenCache = token;
        return token;
      } catch (error) {
        console.error('Get token error:', error);
        return null;
      }
    };
    
    // Start the async operation but return null synchronously
    getTokenAsync();
    return null;
  }
};
