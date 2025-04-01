
import { useState, useMemo } from 'react';
import { User } from '@/types';

/**
 * Hook for searching/filtering employees
 */
export function useEmployeeSearch(employees: User[]) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees)) {
      console.warn('useEmployeeSearch: employees is not an array', employees);
      return [];
    }
    
    console.log(`Filtering ${employees.length} employees with search query: "${searchQuery}"`);
    
    if (!searchQuery.trim()) {
      return employees;
    }
    
    return employees.filter((employee) => {
      if (!employee) return false;
      
      const searchTerm = searchQuery.toLowerCase().trim();
      
      // Check each field that could match the search
      const firstNameMatch = employee.firstName?.toLowerCase()?.includes(searchTerm) || false;
      const lastNameMatch = employee.lastName?.toLowerCase()?.includes(searchTerm) || false;
      const emailMatch = employee.email?.toLowerCase()?.includes(searchTerm) || false;
      const positionMatch = employee.position?.toLowerCase()?.includes(searchTerm) || false;
      const employeeIdMatch = employee.employeeId?.toLowerCase()?.includes(searchTerm) || false;
      const departmentMatch = employee.department?.toLowerCase()?.includes(searchTerm) || false;
      
      return firstNameMatch || lastNameMatch || emailMatch || positionMatch || employeeIdMatch || departmentMatch;
    });
  }, [employees, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredEmployees
  };
}
