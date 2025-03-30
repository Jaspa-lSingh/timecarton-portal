
import { User } from '@/types';
import { supabase, isAuthenticated } from '@/lib/supabase';

// Types for service responses
interface AuthResponse {
  data?: any;
  error?: string;
}

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

      return { data: authData };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: error instanceof Error ? error.message : 'Registration failed' };
    }
  },

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      return { data };
    } catch (error) {
      console.error('Login error:', error);
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw new Error(error.message);

      return { data: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: error instanceof Error ? error.message : 'Logout failed' };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw new Error(error.message);

      if (data.user) {
        // Get additional user data from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) throw new Error(userError.message);

        return { data: { ...data.user, ...userData } };
      }

      return { data: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to get current user' };
    }
  },

  // Check if the user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    return await isAuthenticated();
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

      return { data: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  },
};
