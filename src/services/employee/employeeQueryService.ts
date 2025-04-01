
import { User, ApiResponse } from '@/types';
import { employeeFetchService, employeeSearchService, employeeMutationService } from './query';

export const employeeQueryService = {
  // Get all employees
  getEmployees: employeeFetchService.getEmployees,
  
  // Get employee by ID
  getEmployeeById: employeeFetchService.getEmployeeById,
  
  // Create new employee
  createEmployee: employeeMutationService.createEmployee,
  
  // Update employee
  updateEmployee: employeeMutationService.updateEmployee,
  
  // Delete employee
  deleteEmployee: employeeMutationService.deleteEmployee,
  
  // Search employees
  searchEmployees: employeeSearchService.searchEmployees,
  
  // Filter employees by department
  filterByDepartment: employeeSearchService.filterByDepartment
};
