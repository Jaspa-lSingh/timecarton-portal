
import { User, ApiResponse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transformUser, transformUsers } from '../employeeTransformers';
import { employeeFetchService } from './employeeFetchService';

/**
 * Service for searching and filtering employee data
 */
export const employeeSearchService = {
  // Search employees
  searchEmployees: async (query: string): Promise<ApiResponse<User[]>> => {
    try {
      if (!query.trim()) {
        return await employeeFetchService.getEmployees();
      }
      
      const searchQuery = `%${query.toLowerCase()}%`;
      console.log(`Searching employees with query: "${searchQuery}"`);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`first_name.ilike.${searchQuery},last_name.ilike.${searchQuery},email.ilike.${searchQuery},position.ilike.${searchQuery},department.ilike.${searchQuery},employee_id.ilike.${searchQuery}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error searching employees:', error);
        return { error: error.message };
      }
      
      console.log(`Found ${data?.length || 0} employees matching search query`);
      // Transform all users using the transformUsers function
      const transformedUsers = transformUsers(data || []);
      
      return { data: transformedUsers };
    } catch (error) {
      console.error('Error searching employees:', error);
      return { error: 'Network error when searching employees' };
    }
  },
  
  // Filter employees by department
  filterByDepartment: async (department: string): Promise<ApiResponse<User[]>> => {
    try {
      console.log(`Filtering employees by department: ${department}`);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('department', department)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error filtering employees by department ${department}:`, error);
        return { error: error.message };
      }
      
      console.log(`Found ${data?.length || 0} employees in department: ${department}`);
      // Transform all users using the transformUsers function
      const transformedUsers = transformUsers(data || []);
      
      return { data: transformedUsers };
    } catch (error) {
      console.error(`Error filtering employees by department ${department}:`, error);
      return { error: 'Network error when filtering employees' };
    }
  }
};
