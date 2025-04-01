
import { User, ApiResponse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth';
import { transformUser } from '../employeeTransformers';

/**
 * Service for fetching employee data from Supabase
 */
export const employeeFetchService = {
  /**
   * Get all employees
   * @returns Promise<ApiResponse<User[]>> Array of employees
   */
  getEmployees: async (): Promise<ApiResponse<User[]>> => {
    try {
      console.log('Fetching employees from Supabase');
      
      // Check authentication status
      const isAdmin = authService.isAdmin();
      console.log('Auth status:', { 
        isAuthenticated: await authService.isAuthenticated(),
        isAdmin
      });
      
      if (!isAdmin) {
        console.error('User is not authorized to fetch all employees');
        return { error: 'Not authorized' };
      }
      
      // Check if using super admin (non-database user)
      const currentUser = authService.getCurrentUser();
      const isSuperAdmin = currentUser?.id === '875626';
      console.log('Super admin check:', { isSuperAdmin });
      
      // Fetch all users from the database
      const { data: users, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Error fetching employees:', error);
        return { error: error.message };
      }
      
      console.log('Employees data returned from Supabase:', users);
      console.log('Number of employees fetched from database:', users?.length || 0);
      
      // Initialize the array for transformed users
      const transformedUsers: User[] = [];
      
      // If super admin, add them to the list (they don't exist in DB)
      if (isSuperAdmin && currentUser) {
        console.log('Adding super admin to employees list');
        
        const superAdminUser: User = {
          id: currentUser.id || '875626',
          email: currentUser.email || 'admin@example.com',
          firstName: currentUser.firstName || 'Admin',
          lastName: currentUser.lastName || 'User',
          role: 'admin',
          position: 'Super Administrator',
          employeeId: 'SUPER-ADMIN',
          department: 'Management',
          hourlyRate: 0,
          phoneNumber: '',
          avatar: '',
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
          }
        };
        
        transformedUsers.push(superAdminUser);
      }
      
      // Transform database users to application User type
      if (users && Array.isArray(users) && users.length > 0) {
        console.log('Transforming users array of length:', users.length);
        
        for (const user of users) {
          try {
            if (user) {
              const transformedUser = transformUser(user);
              if (transformedUser) {
                console.log(`Successfully transformed user: ${user.id}`);
                transformedUsers.push(transformedUser);
              } else {
                console.error(`Failed to transform user ${user.id}: transformUser returned null`);
              }
            }
          } catch (err) {
            console.error(`Error transforming user:`, err);
          }
        }
      } else {
        console.warn('No users found in database or users is not an array');
      }
      
      console.log('Number of successfully transformed users:', transformedUsers.length);
      console.log('Transformed users:', transformedUsers);
      
      return { 
        data: transformedUsers,
        message: `Found ${transformedUsers.length} employees`
      };
    } catch (error) {
      console.error('Error in getEmployees:', error);
      return { error: 'Failed to fetch employees' };
    }
  },

  /**
   * Get employee by ID
   * @param id Employee ID
   * @returns Promise<ApiResponse<User>> Employee data
   */
  getEmployeeById: async (id: string): Promise<ApiResponse<User>> => {
    try {
      // Handle super admin (not in database)
      const currentUser = authService.getCurrentUser();
      if (id === '875626' && currentUser?.id === '875626') {
        const superAdminUser: User = {
          id: currentUser.id,
          email: currentUser.email || '',
          firstName: currentUser.firstName || 'Admin',
          lastName: currentUser.lastName || 'User',
          role: 'admin',
          position: 'Super Administrator',
          employeeId: 'SUPER-ADMIN',
          department: '',
          hourlyRate: 0,
          phoneNumber: '',
          avatar: '',
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
          }
        };
        
        return { data: superAdminUser };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error(`Error fetching employee with ID ${id}:`, error);
        return { error: error.message };
      }
      
      if (!data) {
        console.error(`No employee found with ID ${id}`);
        return { error: 'Employee not found' };
      }
      
      const transformedUser = transformUser(data);
      if (!transformedUser) {
        return { error: 'Error transforming employee data' };
      }
      
      return { 
        data: transformedUser,
        message: 'Employee found'
      };
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      return { error: 'Failed to fetch employee' };
    }
  }
};
