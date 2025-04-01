
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
      
      const updateData: Record<string, any> = {};
      
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
      
      if (userData.address) {
        if (userData.address.street !== undefined) updateData.street = userData.address.street;
        if (userData.address.city !== undefined) updateData.city = userData.address.city;
        if (userData.address.state !== undefined) updateData.state = userData.address.state;
        if (userData.address.country !== undefined) updateData.country = userData.address.country;
        if (userData.address.zipCode !== undefined) updateData.zip_code = userData.address.zipCode;
      }
      
      console.log('Update data prepared:', updateData);
      
      if (Object.keys(updateData).length === 0) {
        console.log('No fields to update');
        return { error: 'No fields to update' };
      }
      
      // Special handling for super admin
      if (id === '875626') {
        console.log('Updating super admin user (frontend only)');
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          return { error: 'Super admin user not found' };
        }
        
        // Update only in memory/session
        const updatedSuperAdmin: User = {
          ...currentUser,
          firstName: userData.firstName || currentUser.firstName || 'Admin',
          lastName: userData.lastName || currentUser.lastName || 'User',
          email: userData.email || currentUser.email || '',
          position: userData.position || currentUser.position || 'Super Administrator',
          employeeId: 'SUPER-ADMIN',
          department: userData.department || currentUser.department || '',
          hourlyRate: userData.hourlyRate || currentUser.hourlyRate || 0,
          phoneNumber: userData.phoneNumber || currentUser.phoneNumber || '',
          avatar: userData.avatar || currentUser.avatar || '',
          address: {
            street: userData.address?.street || currentUser.address?.street || '',
            city: userData.address?.city || currentUser.address?.city || '',
            state: userData.address?.state || currentUser.address?.state || '',
            country: userData.address?.country || currentUser.address?.country || '',
            zipCode: userData.address?.zipCode || currentUser.address?.zipCode || '',
          }
        };
        
        return { 
          data: updatedSuperAdmin,
          message: 'Super admin updated successfully' 
        };
      }
      
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
      
      // Debug data before update
      console.log(`Executing update for employee ID ${id} with data:`, updateData);
      
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
      
      // Debug response after update
      console.log(`Update response for employee ID ${id}:`, data);
      
      if (!data) {
        console.error(`Update succeeded but no data returned for ID ${id}`);
        // Fetch the updated user to return complete data
        const { data: refreshedUser, error: refreshError } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (refreshError || !refreshedUser) {
          console.error(`Failed to fetch updated employee data for ID ${id}:`, refreshError);
          return { 
            message: 'Employee updated successfully but unable to fetch updated data',
            data: { id, ...userData } as User 
          };
        }
        
        const transformedUser = transformUser(refreshedUser);
        return { 
          data: transformedUser || ({ id, ...userData } as User), 
          message: 'Employee updated successfully' 
        };
      }
      
      console.log(`Employee with ID ${id} updated successfully:`, data);
      const transformedUser = transformUser(data);
      
      if (!transformedUser) {
        console.error(`Failed to transform updated user data for ID ${id}`);
        return {
          error: 'Failed to transform updated employee data'
        };
      }
      
      return { 
        data: transformedUser, 
        message: 'Employee updated successfully' 
      };
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      return { error: 'Network error when updating employee' };
    }
  },
  
  // Delete employee
  deleteEmployee: async (id: string): Promise<ApiResponse<void>> => {
    console.log(`Starting delete employee process for ID: ${id}`);
    
    if (!authService.isAdmin()) {
      console.error("Delete operation not authorized - user is not admin");
      return { error: 'Not authorized' };
    }
    
    if (id === '875626') {
      console.error("Attempted to delete super admin account");
      return { error: 'Cannot delete super admin account' };
    }
    
    try {
      console.log(`Attempting to delete employee with ID: ${id}`);
      
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
        console.log(`No employee found with ID ${id}, but reporting success`);
        return { message: 'Employee deleted successfully' };
      }
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting employee with ID ${id}:`, error);
        return { error: error.message };
      }
      
      console.log(`Employee with ID ${id} deleted successfully`);
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      return { error: 'Network error when deleting employee' };
    }
  }
};
