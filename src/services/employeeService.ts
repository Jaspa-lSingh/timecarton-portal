
import { User, ApiResponse } from '@/types';
import { supabase } from '@/lib/supabase';
import { authService } from './authService';

// Map database user to our app User type
const mapToUser = (dbUser: any): User => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.first_name || '',
    lastName: dbUser.last_name || '',
    role: dbUser.role || 'employee',
    employeeId: dbUser.employee_id,
    position: dbUser.position,
    department: dbUser.department,
    hourlyRate: dbUser.hourly_rate,
    phoneNumber: dbUser.phone_number,
    avatar: dbUser.avatar_url,
    address: {
      street: dbUser.street,
      city: dbUser.city,
      state: dbUser.state,
      country: dbUser.country,
      zipCode: dbUser.zip_code,
    }
  };
};

// Employee service with real API endpoints
export const employeeService = {
  // Get all employees
  getEmployees: async (): Promise<ApiResponse<User[]>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'employee');
        
      if (error) {
        return { error: error.message || 'Failed to fetch employees' };
      }
      
      const employees = data.map(mapToUser);
      return { data: employees };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return { error: 'Network error when fetching employees' };
    }
  },
  
  // Get employee by ID
  getEmployeeById: async (id: string): Promise<ApiResponse<User>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        return { error: error.message || 'Failed to fetch employee' };
      }
      
      return { data: mapToUser(data) };
    } catch (error) {
      console.error('Error fetching employee:', error);
      return { error: 'Network error when fetching employee details' };
    }
  },
  
  // Create a new employee (admin only)
  createEmployee: async (employeeData: Partial<User>): Promise<ApiResponse<User>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // First create auth user
      const password = Math.random().toString(36).slice(-8); // Generate random password
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: employeeData.email || '',
        password: password,
        email_confirm: true,
        user_metadata: {
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          role: 'employee'
        }
      });
      
      if (authError) {
        return { error: authError.message };
      }
      
      if (!authData.user) {
        return { error: 'Failed to create user auth record' };
      }
      
      // Then add user data to users table
      const { error } = await supabase.from('users').insert({
        id: authData.user.id,
        email: employeeData.email,
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        role: 'employee',
        employee_id: employeeData.employeeId,
        position: employeeData.position,
        department: employeeData.department,
        hourly_rate: employeeData.hourlyRate,
        phone_number: employeeData.phoneNumber,
      });
      
      if (error) {
        return { error: error.message || 'Failed to create employee' };
      }
      
      // Get the newly created user
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (fetchError) {
        return { error: fetchError.message };
      }
      
      return { 
        data: mapToUser(data), 
        message: 'Employee created successfully. Temporary password: ' + password 
      };
    } catch (error) {
      console.error('Error creating employee:', error);
      return { error: 'Network error when creating employee' };
    }
  },
  
  // Update an employee (admin only)
  updateEmployee: async (id: string, employeeData: Partial<User>): Promise<ApiResponse<User>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          position: employeeData.position,
          department: employeeData.department,
          hourly_rate: employeeData.hourlyRate,
          phone_number: employeeData.phoneNumber,
          employee_id: employeeData.employeeId,
          street: employeeData.address?.street,
          city: employeeData.address?.city,
          state: employeeData.address?.state,
          country: employeeData.address?.country,
          zip_code: employeeData.address?.zipCode,
        })
        .eq('id', id);
        
      if (error) {
        return { error: error.message || 'Failed to update employee' };
      }
      
      // Get the updated user
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        return { error: fetchError.message };
      }
      
      return { 
        data: mapToUser(data), 
        message: 'Employee updated successfully' 
      };
    } catch (error) {
      console.error('Error updating employee:', error);
      return { error: 'Network error when updating employee' };
    }
  },
  
  // Delete an employee (admin only)
  deleteEmployee: async (id: string): Promise<ApiResponse<void>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Delete from users table
      const { error: userDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
        
      if (userDeleteError) {
        return { error: userDeleteError.message || 'Failed to delete employee records' };
      }
      
      // Delete the auth user
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(id);
      
      if (authDeleteError) {
        return { error: authDeleteError.message || 'Failed to delete employee authentication' };
      }
      
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      console.error('Error deleting employee:', error);
      return { error: 'Network error when deleting employee' };
    }
  },
  
  // Get employees by department
  getEmployeesByDepartment: async (department: string): Promise<ApiResponse<User[]>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('department', department)
        .eq('role', 'employee');
        
      if (error) {
        return { error: error.message || 'Failed to fetch employees by department' };
      }
      
      const employees = data.map(mapToUser);
      return { data: employees };
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      return { error: 'Network error when fetching employees' };
    }
  },
  
  // Upload employee profile photo
  uploadProfilePhoto: async (employeeId: string, photoData: File): Promise<ApiResponse<{photoUrl: string}>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const fileExt = photoData.name.split('.').pop();
      const fileName = `${employeeId}-${Date.now()}.${fileExt}`;
      const filePath = `employees/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('profile-photos')
        .upload(filePath, photoData);
        
      if (uploadError) {
        return { error: uploadError.message || 'Failed to upload profile photo' };
      }
      
      // Get the public URL
      const { data } = supabase
        .storage
        .from('profile-photos')
        .getPublicUrl(filePath);
        
      const photoUrl = data.publicUrl;
      
      // Update user with photo URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: photoUrl })
        .eq('id', employeeId);
        
      if (updateError) {
        return { error: updateError.message || 'Failed to update profile with photo' };
      }
      
      return { 
        data: { photoUrl }, 
        message: 'Profile photo uploaded successfully' 
      };
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      return { error: 'Network error when uploading profile photo' };
    }
  }
};
