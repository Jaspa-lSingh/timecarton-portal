
import { User, ApiResponse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth';
import { transformUser, transformUsers } from './employeeTransformers';

export const employeeQueryService = {
  // Get all employees
  getEmployees: async (): Promise<ApiResponse<User[]>> => {
    try {
      console.log('Fetching employees from Supabase');

      // Check if user is authenticated and has admin privileges
      const isAuthenticated = await authService.isAuthenticated();
      const isAdmin = authService.isAdmin();
      console.log('Auth status:', { isAuthenticated, isAdmin });
      
      if (!isAuthenticated) {
        console.error('User is not authenticated');
        return { error: 'Authentication required' };
      }
      
      if (!isAdmin) {
        console.error('User does not have admin privileges');
        return { error: 'Admin privileges required' };
      }
      
      // First check if auth users exist that need to be synced to the users table
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
      } else {
        console.log('Auth users found:', authUsers?.users?.length || 0);
        
        // Check if users exist in the auth system but not in our users table
        if (authUsers?.users?.length > 0) {
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
      
      // Now query all users from the users table
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
      
      console.log('Number of employees fetched:', data.length);
      
      const transformedUsers = transformUsers(data);
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
        .single();
      
      if (error) {
        console.error(`Error fetching employee with ID ${id}:`, error);
        return { error: error.message };
      }
      
      return { data: transformUser(data) };
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      return { error: 'Network error when fetching employee' };
    }
  },
  
  // Create new employee
  createEmployee: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // First create auth user (if this is managed by you)
      // Then add user profile data
      const dbUser = {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role || 'employee',
        employee_id: userData.employeeId,
        position: userData.position,
        department: userData.department,
        hourly_rate: userData.hourlyRate,
        phone_number: userData.phoneNumber,
        avatar_url: userData.avatar,
        street: userData.address?.street,
        city: userData.address?.city,
        state: userData.address?.state,
        country: userData.address?.country,
        zip_code: userData.address?.zipCode
      };
      
      const { data, error } = await supabase
        .from('users')
        .insert([dbUser])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating employee:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformUser(data), 
        message: 'Employee created successfully' 
      };
    } catch (error) {
      console.error('Error creating employee:', error);
      return { error: 'Network error when creating employee' };
    }
  },
  
  // Update employee
  updateEmployee: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const dbUser = {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        employee_id: userData.employeeId,
        position: userData.position,
        department: userData.department,
        hourly_rate: userData.hourlyRate,
        phone_number: userData.phoneNumber,
        avatar_url: userData.avatar,
        street: userData.address?.street,
        city: userData.address?.city,
        state: userData.address?.state,
        country: userData.address?.country,
        zip_code: userData.address?.zipCode
      };
      
      const { data, error } = await supabase
        .from('users')
        .update(dbUser)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating employee with ID ${id}:`, error);
        return { error: error.message };
      }
      
      return { 
        data: transformUser(data), 
        message: 'Employee updated successfully' 
      };
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      return { error: 'Network error when updating employee' };
    }
  },
  
  // Delete employee
  deleteEmployee: async (id: string): Promise<ApiResponse<void>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting employee with ID ${id}:`, error);
        return { error: error.message };
      }
      
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      return { error: 'Network error when deleting employee' };
    }
  },
  
  // Search employees
  searchEmployees: async (query: string): Promise<ApiResponse<User[]>> => {
    try {
      if (!query.trim()) {
        return await employeeQueryService.getEmployees();
      }
      
      const searchQuery = `%${query.toLowerCase()}%`;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`first_name.ilike.${searchQuery},last_name.ilike.${searchQuery},email.ilike.${searchQuery}`);
      
      if (error) {
        console.error('Error searching employees:', error);
        return { error: error.message };
      }
      
      return { data: transformUsers(data) };
    } catch (error) {
      console.error('Error searching employees:', error);
      return { error: 'Network error when searching employees' };
    }
  },
  
  // Filter employees by department
  filterByDepartment: async (department: string): Promise<ApiResponse<User[]>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('department', department);
      
      if (error) {
        console.error(`Error filtering employees by department ${department}:`, error);
        return { error: error.message };
      }
      
      return { data: transformUsers(data) };
    } catch (error) {
      console.error(`Error filtering employees by department ${department}:`, error);
      return { error: 'Network error when filtering employees' };
    }
  }
};
