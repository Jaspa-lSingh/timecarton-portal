
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
      if (currentUser?.id === '875626') {
        console.log('Super admin detected, skipping auth users sync');
      }
      
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
      
      // If super admin, add them to the list (they don't exist in DB)
      if (currentUser?.id === '875626') {
        console.log('Adding super admin to employees list');
        if (users) {
          users.push({
            id: currentUser.id,
            email: currentUser.email,
            first_name: currentUser.firstName,
            last_name: currentUser.lastName,
            role: currentUser.role,
            position: currentUser.position,
            employee_id: 'SUPER-ADMIN'
          });
        }
      }
      
      console.log('Final employee count before transformation:', users?.length || 0);
      
      // Transform database users to application User type
      if (!users) {
        return { data: [] };
      }
      
      // Transform users from database format to application format
      console.log('Transforming users array of length:', users.length);
      
      const transformedUsers: User[] = [];
      
      for (const user of users) {
        console.log('Transforming user:', user);
        
        try {
          if (user) {
            const transformedUser = transformUser(user);
            if (transformedUser) {
              transformedUsers.push(transformedUser);
            }
          }
        } catch (err) {
          console.error(`Error transforming user ${user?.id}:`, err);
        }
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
        return { 
          data: currentUser
        };
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
