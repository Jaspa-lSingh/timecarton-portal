
import { User, ApiResponse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth';
import { transformUser } from '../employeeTransformers';

/**
 * Service for creating, updating, and deleting employee data
 */
export const employeeMutationService = {
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
      console.log(`Updating employee with ID ${id}`, userData);
      
      // Filter out undefined values to avoid nullifying existing data
      const updateData: Record<string, any> = {};
      
      // Only include defined values for the main user fields
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.firstName !== undefined) updateData.first_name = userData.firstName;
      if (userData.lastName !== undefined) updateData.last_name = userData.lastName;
      if (userData.role !== undefined) updateData.role = userData.role;
      if (userData.employeeId !== undefined) updateData.employee_id = userData.employeeId;
      if (userData.position !== undefined) updateData.position = userData.position;
      if (userData.department !== undefined) updateData.department = userData.department;
      if (userData.hourlyRate !== undefined) updateData.hourly_rate = userData.hourlyRate;
      if (userData.phoneNumber !== undefined) updateData.phone_number = userData.phoneNumber;
      if (userData.avatar !== undefined) updateData.avatar_url = userData.avatar;
      
      // Address fields
      if (userData.address) {
        if (userData.address.street !== undefined) updateData.street = userData.address.street;
        if (userData.address.city !== undefined) updateData.city = userData.address.city;
        if (userData.address.state !== undefined) updateData.state = userData.address.state;
        if (userData.address.country !== undefined) updateData.country = userData.address.country;
        if (userData.address.zipCode !== undefined) updateData.zip_code = userData.address.zipCode;
      }
      
      console.log('Update data prepared:', updateData);
      
      // First verify the user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .maybeSingle();
        
      if (checkError) {
        console.error(`Error checking if employee with ID ${id} exists:`, checkError);
        return { error: checkError.message };
      }
      
      if (!existingUser) {
        console.error(`No employee found with ID ${id} to update`);
        return { error: 'Employee not found' };
      }
      
      // Perform the update
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error(`Error updating employee with ID ${id}:`, error);
        return { error: error.message };
      }
      
      if (!data) {
        console.error(`Update succeeded but no data returned for ID ${id}`);
        // Return success message even if no data returned,
        // since the update operation itself succeeded
        return { 
          message: 'Employee updated successfully',
          data: { id, ...userData } as User // Return the input data as a fallback
        };
      }
      
      console.log(`Employee with ID ${id} updated successfully:`, data);
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
  }
};
