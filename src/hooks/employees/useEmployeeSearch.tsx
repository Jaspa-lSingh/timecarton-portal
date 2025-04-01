
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
    
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    
    return employees.filter((employee) => {
      if (!employee) return false;
      
      // Check if any search term matches any employee field
      return searchTerms.some(term => {
        const firstNameMatch = employee.firstName?.toLowerCase()?.includes(term) || false;
        const lastNameMatch = employee.lastName?.toLowerCase()?.includes(term) || false;
        const emailMatch = employee.email?.toLowerCase()?.includes(term) || false;
        const positionMatch = employee.position?.toLowerCase()?.includes(term) || false;
        const employeeIdMatch = employee.employeeId?.toLowerCase()?.includes(term) || false;
        const departmentMatch = employee.department?.toLowerCase()?.includes(term) || false;
        
        // Return true if any field matches
        return firstNameMatch || lastNameMatch || emailMatch || positionMatch || employeeIdMatch || departmentMatch;
      });
    });
  }, [employees, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredEmployees
  };
}
