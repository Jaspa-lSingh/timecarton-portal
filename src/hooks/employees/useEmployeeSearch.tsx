
import { useState, useMemo } from 'react';
import { User } from '@/types';

/**
 * Hook for searching/filtering employees
 */
export function useEmployeeSearch(employees: User[]) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees)) return [];
    
    return employees.filter((employee) => {
      if (!employee) return false;
      
      const searchTerm = searchQuery.toLowerCase();
      return (
        employee.firstName?.toLowerCase()?.includes(searchTerm) ||
        employee.lastName?.toLowerCase()?.includes(searchTerm) ||
        employee.email?.toLowerCase()?.includes(searchTerm) ||
        employee.position?.toLowerCase()?.includes(searchTerm) ||
        employee.employeeId?.toLowerCase()?.includes(searchTerm) ||
        employee.department?.toLowerCase()?.includes(searchTerm)
      );
    });
  }, [employees, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredEmployees
  };
}
