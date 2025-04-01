
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
        console.log('Empty search query, returning all employees');
        return await employeeFetchService.getEmployees();
      }
      
      const searchQuery = `%${query.toLowerCase()}%`;
      console.log(`Executing database search with query: "${searchQuery}"`);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`first_name.ilike.${searchQuery},last_name.ilike.${searchQuery},email.ilike.${searchQuery},position.ilike.${searchQuery},department.ilike.${searchQuery},employee_id.ilike.${searchQuery}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error searching employees:', error);
        return { error: error.message };
      }
      
      console.log(`Search results: Found ${data?.length || 0} employees matching search query`);
      
      if (!data || !Array.isArray(data)) {
        console.log('No search results found or invalid data format returned');
        return { data: [] };
      }
      
      // Transform all users using the transformUsers function
      const transformedUsers = transformUsers(data);
      
      // Add super admin if needed
      const currentUser = await supabase.auth.getUser();
      if (currentUser.data?.user?.id === '875626') {
        const superAdmin: User = {
          id: '875626',
          email: currentUser.data.user.email || 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
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
        
        // Check if super admin matches search query
        const searchTerms = query.toLowerCase().trim().split(/\s+/);
        const matchesSuperAdmin = searchTerms.some(term => 
          superAdmin.firstName.toLowerCase().includes(term) || 
          superAdmin.lastName.toLowerCase().includes(term) || 
          superAdmin.email.toLowerCase().includes(term) || 
          superAdmin.position.toLowerCase().includes(term) || 
          'super'.includes(term) || 
          'admin'.includes(term) ||
          'administrator'.includes(term) ||
          superAdmin.department.toLowerCase().includes(term)
        );
        
        if (matchesSuperAdmin) {
          console.log('Adding super admin to search results');
          transformedUsers.unshift(superAdmin);
        }
      }
      
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
      
      // Add super admin if department is Management
      if (department.toLowerCase() === 'management') {
        const currentUser = await supabase.auth.getUser();
        if (currentUser.data?.user?.id === '875626') {
          const superAdmin: User = {
            id: '875626',
            email: currentUser.data.user.email || 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
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
          transformedUsers.unshift(superAdmin);
        }
      }
      
      return { data: transformedUsers };
    } catch (error) {
      console.error(`Error filtering employees by department ${department}:`, error);
      return { error: 'Network error when filtering employees' };
    }
  }
};
