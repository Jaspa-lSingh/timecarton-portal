import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { AuthResponse, authState } from './authTypes';

export const userService = {
  // Get current user - returns a User object, not a Promise<AuthResponse>
  getCurrentUser(): User | null {
    // Return from cache if available
    if (authState.currentUserCache) return authState.currentUserCache;
    
    // Check if we have a super admin session in localStorage
    const isSuperAdminSession = localStorage.getItem('superAdminSession') === 'true';
    if (isSuperAdminSession) {
      const superAdminUser: User = {
        id: '875626',
        email: 'jskamboj521@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        position: 'Super Administrator',
      };
      authState.currentUserCache = superAdminUser;
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
        authState.currentUserCache = user;

        // Get and cache the token
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          authState.currentTokenCache = sessionData.session.access_token;
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
  
  // Check if current user is admin
  isAdmin(): boolean {
    const user = userService.getCurrentUser();
    return user?.role === 'admin';
  },
  
  // Check if user has a specific permission
  hasPermission(permission: string): boolean {
    // Simplified permission check - in a real app this would be more sophisticated
    const user = userService.getCurrentUser();
    
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
      if (authState.currentUserCache && authState.currentUserCache.id === userId) {
        authState.currentUserCache = {
          ...authState.currentUserCache,
          firstName: userData.firstName || authState.currentUserCache.firstName,
          lastName: userData.lastName || authState.currentUserCache.lastName,
          position: userData.position || authState.currentUserCache.position,
          phoneNumber: userData.phoneNumber || authState.currentUserCache.phoneNumber,
        };
      }

      return { data: authState.currentUserCache, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  },
};
