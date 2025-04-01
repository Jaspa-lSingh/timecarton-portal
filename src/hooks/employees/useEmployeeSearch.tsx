
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
    
    const searchTerm = searchQuery.toLowerCase().trim();
    
    return employees.filter((employee) => {
      if (!employee) return false;
      
      // Check each field that could match the search
      const firstNameMatch = employee.firstName?.toLowerCase()?.includes(searchTerm) || false;
      const lastNameMatch = employee.lastName?.toLowerCase()?.includes(searchTerm) || false;
      const emailMatch = employee.email?.toLowerCase()?.includes(searchTerm) || false;
      const positionMatch = employee.position?.toLowerCase()?.includes(searchTerm) || false;
      const employeeIdMatch = employee.employeeId?.toLowerCase()?.includes(searchTerm) || false;
      const departmentMatch = employee.department?.toLowerCase()?.includes(searchTerm) || false;
      
      // Return true if any field matches
      const hasMatch = firstNameMatch || lastNameMatch || emailMatch || positionMatch || employeeIdMatch || departmentMatch;
      
      return hasMatch;
    });
  }, [employees, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredEmployees
  };
}
