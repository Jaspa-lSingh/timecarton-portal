
import { User, ApiResponse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth';
import { transformUsers, transformUser } from '../employeeTransformers';

/**
 * Service for fetching employee data from Supabase
 */
export const employeeFetchService = {
  // Get all employees
  getEmployees: async (): Promise<ApiResponse<User[]>> => {
    try {
      console.log('Fetching employees from Supabase');

      // Check if user is authenticated and has admin privileges
      const isAuthenticated = await authService.isAuthenticated();
      const isAdmin = authService.isAdmin();
      const currentUser = authService.getCurrentUser();
      console.log('Auth status:', { isAuthenticated, isAdmin });
      
      if (!isAuthenticated) {
        console.error('User is not authenticated');
        return { error: 'Authentication required' };
      }
      
      if (!isAdmin) {
        console.error('User does not have admin privileges');
        return { error: 'Admin privileges required' };
      }
      
      // Super admin doesn't need to sync auth users since they're using a different auth mechanism
      const isSuperAdmin = currentUser?.id === '875626';
      
      // Only attempt to sync auth users if not the super admin (who doesn't have this permission)
      if (!isSuperAdmin) {
        try {
          await employeeFetchService._syncAuthUsers();
        } catch (syncError) {
          console.error('Error during user sync process:', syncError);
          // Continue execution - we still want to fetch existing users even if sync fails
        }
      } else {
        console.log('Super admin detected, skipping auth users sync');
      }
      
      // Now query all users from the users table with more detailed logging
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Error fetching employees:', error);
        return { error: error.message };
      }
      
      console.log('Employees data returned from Supabase:', data);
      
      // Check if we have data and it's an array
      if (!data) {
        console.warn('No employees found or data is null');
        return { data: [] };
      }
      
      if (!Array.isArray(data)) {
        console.warn('Data returned is not an array:', data);
        return { data: [] };
      }
      
      console.log('Number of employees fetched from database:', data.length);
      
      // Always ensure we have an array to work with
      let allEmployees = [...data];
      
      // For Super Admin, manually add their own user if it's not in the returned data
      if (isSuperAdmin && currentUser) {
        const superAdminExists = allEmployees.some(user => user.id === currentUser.id);
        
        if (!superAdminExists) {
          console.log('Adding super admin to employees list');
          allEmployees.push({
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
      
      console.log('Final employee count before transformation:', allEmployees.length);
      const transformedUsers = transformUsers(allEmployees);
      console.log('Transformed users:', transformedUsers);
      console.log('Number of transformed users:', transformedUsers.length);
      
      return { data: transformedUsers };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return { error: 'Network error when fetching employees' };
    }
  },
  
  // Get employee by ID
  getEmployeeById: async (id: string): Promise<ApiResponse<User>> => {
    try {
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
      
      return { data: transformUser(data) };
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      return { error: 'Network error when fetching employee' };
    }
  },
  
  // Helper method to sync auth users with the users table
  _syncAuthUsers: async (): Promise<void> => {
    // Check if auth users are not synced to the users table
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      
      // If error is permission related, we'll still try to query users
      if (authError.message && (
          authError.message.includes("not_admin") ||
          authError.message.includes("token needs to have") ||
          authError.message.includes("permission")
        )) {
        console.warn('Cannot sync auth users due to permission issues. Will still attempt to fetch existing users.');
      }
    } else if (authUsers?.users?.length > 0) {
      console.log('Auth users found:', authUsers.users.length);
      
      // Check existing users in our users table
      const { data: existingUsers, error: existingError } = await supabase
        .from('users')
        .select('id');
        
      if (existingError) {
        console.error('Error fetching existing users:', existingError);
      } else {
        const existingIds = new Set(existingUsers?.map(user => user.id) || []);
        const missingUsers = authUsers.users.filter(user => !existingIds.has(user.id));
        
        console.log('Missing users to sync:', missingUsers.length);
        
        // Sync missing users to our users table
        if (missingUsers.length > 0) {
          const usersToInsert = missingUsers.map(user => ({
            id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            role: user.user_metadata?.role || 'employee',
          }));
          
          const { data: insertedData, error: insertError } = await supabase
            .from('users')
            .insert(usersToInsert)
            .select();
            
          if (insertError) {
            console.error('Error syncing users to users table:', insertError);
          } else {
            console.log('Successfully synced users:', insertedData?.length || 0);
          }
        }
      }
    }
  }
};
