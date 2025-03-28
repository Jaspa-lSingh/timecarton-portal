
import { User, ApiResponse } from '@/types';
import { authService } from './authService';

// Mock employee data for demonstration
const mockEmployees: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    position: 'Manager',
    hourlyRate: 25,
    phoneNumber: '555-123-4567',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    email: 'employee@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'employee',
    position: 'Barista',
    hourlyRate: 15.5,
    phoneNumber: '555-987-6543',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'employee',
    position: 'Barista',
    hourlyRate: 15.5,
    phoneNumber: '555-546-8765',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    email: 'robert@example.com',
    firstName: 'Robert',
    lastName: 'Johnson',
    role: 'employee',
    position: 'Server',
    hourlyRate: 12.75,
    phoneNumber: '555-789-0123',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: 'employee',
    position: 'Cook',
    hourlyRate: 17.25,
    phoneNumber: '555-321-6547',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }
];

// Employee service
export const employeeService = {
  // Get all employees
  getEmployees: async (): Promise<ApiResponse<User[]>> => {
    // Check if user is authenticated and an admin
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data for now
      return { data: mockEmployees };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return { error: 'Failed to fetch employees' };
    }
  },
  
  // Get employee by ID
  getEmployeeById: async (id: string): Promise<ApiResponse<User>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const employee = mockEmployees.find(emp => emp.id === id);
      
      if (employee) {
        return { data: employee };
      }
      
      return { error: 'Employee not found' };
    } catch (error) {
      console.error('Error fetching employee:', error);
      return { error: 'Failed to fetch employee details' };
    }
  },
  
  // Create a new employee (admin only)
  createEmployee: async (employeeData: Partial<User>): Promise<ApiResponse<User>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      const newEmployee: User = {
        id: Date.now().toString(),
        email: employeeData.email || '',
        firstName: employeeData.firstName || '',
        lastName: employeeData.lastName || '',
        role: 'employee',
        position: employeeData.position,
        hourlyRate: employeeData.hourlyRate,
        phoneNumber: employeeData.phoneNumber,
        avatar: employeeData.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
      
      return { data: newEmployee, message: 'Employee created successfully' };
    } catch (error) {
      console.error('Error creating employee:', error);
      return { error: 'Failed to create employee' };
    }
  },
  
  // Update an employee (admin only)
  updateEmployee: async (id: string, employeeData: Partial<User>): Promise<ApiResponse<User>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      return { 
        data: { ...employeeData, id } as User, 
        message: 'Employee updated successfully' 
      };
    } catch (error) {
      console.error('Error updating employee:', error);
      return { error: 'Failed to update employee' };
    }
  },
  
  // Delete an employee (admin only)
  deleteEmployee: async (id: string): Promise<ApiResponse<void>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      console.error('Error deleting employee:', error);
      return { error: 'Failed to delete employee' };
    }
  }
};
