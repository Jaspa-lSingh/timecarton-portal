
import { User, ApiResponse } from '@/types';
import { supabase } from '@/lib/supabase';

// Helper function to convert Supabase user to our app User type
const mapUserData = (user: any, userData: any = {}): User => {
  return {
    id: user.id,
    email: user.email || '',
    firstName: userData.first_name || '',
    lastName: userData.last_name || '',
    role: userData.role || 'employee',
    employeeId: userData.employee_id,
    position: userData.position,
    department: userData.department,
    hourlyRate: userData.hourly_rate,
    phoneNumber: userData.phone_number,
    avatar: userData.avatar_url,
    address: {
      street: userData.street,
      city: userData.city,
      state: userData.state,
      country: userData.country,
      zipCode: userData.zip_code,
    }
  };
};

// Authentication service
export const authService = {
  // Login user
  login: async (email: string, password: string, role: string): Promise<ApiResponse<User>> => {
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        return { error: signInError.message };
      }

      if (!signInData.user) {
        return { error: 'User not found' };
      }

      // Fetch user profile data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signInData.user.id)
        .single();

      if (userError) {
        return { error: userError.message };
      }

      // Check if the user has the correct role
      if (role !== userData.role) {
        await supabase.auth.signOut(); // Sign out if wrong role
        return { error: `Invalid login. You don't have ${role} permissions.` };
      }

      const user = mapUserData(signInData.user, userData);
      
      // Save user to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      
      return { data: user };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'An unexpected error occurred' };
    }
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
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
    return supabase.auth.getSession().then(({ data }) => {
      return !!data.session;
    }).catch(() => false);
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
  
  // Get auth token
  getToken: async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  },
  
  // Register user
  register: async (userData: Partial<User>, password: string): Promise<ApiResponse<User>> => {
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email || '',
        password: password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role || 'employee',
          }
        }
      });

      if (authError) {
        return { error: authError.message };
      }

      if (!authData.user) {
        return { error: 'Failed to create user' };
      }

      // Insert additional user data into the users table
      const { error: insertError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role || 'employee',
        employee_id: userData.employeeId,
        position: userData.position,
        department: userData.department,
        hourly_rate: userData.hourlyRate,
        phone_number: userData.phoneNumber,
      });

      if (insertError) {
        console.error('Error inserting user data:', insertError);
        return { error: insertError.message };
      }

      const user = mapUserData(authData.user, {
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role || 'employee',
        employee_id: userData.employeeId,
        position: userData.position,
        department: userData.department,
        hourly_rate: userData.hourlyRate,
        phone_number: userData.phoneNumber,
      });

      return { data: user, message: 'User registered successfully!' };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'An unexpected error occurred' };
    }
  },
  
  // Update user profile
  updateProfile: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      // Update in users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          position: userData.position,
          department: userData.department,
          hourly_rate: userData.hourlyRate,
          phone_number: userData.phoneNumber,
          street: userData.address?.street,
          city: userData.address?.city,
          state: userData.address?.state,
          country: userData.address?.country,
          zip_code: userData.address?.zipCode,
        })
        .eq('id', userId);
      
      if (updateError) {
        return { error: updateError.message };
      }
      
      // Get current user and update it
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
