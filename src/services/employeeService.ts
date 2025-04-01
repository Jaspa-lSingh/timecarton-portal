
import { User, ApiResponse } from '@/types';
import { employeeQueryService } from './employee/employeeQueryService';
import { employeeProfileService } from './employee/employeeProfileService';

export const employeeService = {
  // Get all employees
  getEmployees: employeeQueryService.getEmployees,
  
  // Get employee by ID
  getEmployeeById: employeeQueryService.getEmployeeById,
  
  // Create new employee
  createEmployee: employeeQueryService.createEmployee,
  
  // Update employee
  updateEmployee: employeeQueryService.updateEmployee,
  
  // Delete employee
  deleteEmployee: employeeQueryService.deleteEmployee,
  
  // Search employees
  searchEmployees: employeeQueryService.searchEmployees,
  
  // Filter employees by department
  filterByDepartment: employeeQueryService.filterByDepartment,

  // Upload profile photo
  uploadProfilePhoto: employeeProfileService.uploadProfilePhoto
};
