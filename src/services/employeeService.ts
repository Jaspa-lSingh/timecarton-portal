
import { User, ApiResponse } from '@/types';
import { authService } from './authService';

// Base API URL - use the same as other services
const API_URL = import.meta.env.VITE_API_URL || 'https://api.shiftmaster.com/api';

// Employee service with real API endpoints
export const employeeService = {
  // Get all employees
  getEmployees: async (): Promise<ApiResponse<User[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch employees' };
      }
      
      const data = await response.json();
      return { data: data.employees };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return { error: 'Network error when fetching employees' };
    }
  },
  
  // Get employee by ID
  getEmployeeById: async (id: string): Promise<ApiResponse<User>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/employees/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch employee' };
      }
      
      const data = await response.json();
      return { data: data.employee };
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
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to create employee' };
      }
      
      const data = await response.json();
      return { data: data.employee, message: 'Employee created successfully' };
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
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to update employee' };
      }
      
      const data = await response.json();
      return { 
        data: data.employee, 
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
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to delete employee' };
      }
      
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      console.error('Error deleting employee:', error);
      return { error: 'Network error when deleting employee' };
    }
  },
  
  // Get employees by department
  getEmployeesByDepartment: async (department: string): Promise<ApiResponse<User[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/employees/department/${department}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch employees' };
      }
      
      const data = await response.json();
      return { data: data.employees };
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      return { error: 'Network error when fetching employees' };
    }
  },
  
  // Upload employee profile photo
  uploadProfilePhoto: async (employeeId: string, photoData: File): Promise<ApiResponse<{photoUrl: string}>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const formData = new FormData();
      formData.append('photo', photoData);
      
      const response = await fetch(`${API_URL}/employees/${employeeId}/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to upload profile photo' };
      }
      
      const data = await response.json();
      return { data: data, message: 'Profile photo uploaded successfully' };
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      return { error: 'Network error when uploading profile photo' };
    }
  }
};
