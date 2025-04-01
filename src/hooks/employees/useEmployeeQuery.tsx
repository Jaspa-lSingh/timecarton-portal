
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

/**
 * Hook for fetching employees data
 */
export function useEmployeeQuery(refreshAttempts: number) {
  const {
    data: employees = [],
    isLoading,
    error,
    refetch,
    isRefetching,
    isFetched
  } = useQuery({
    queryKey: ['employees', refreshAttempts],
    queryFn: async () => {
      console.log('Executing employee query function');
      const response = await employeeService.getEmployees();
      console.log('Employee query response:', response);
      
      if (response.error) {
        console.error('Error in query function:', response.error);
        toast({
          title: 'Error loading employees',
          description: response.error,
          variant: 'destructive'
        });
        throw new Error(response.error);
      }
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('No data returned from query function or data is not an array');
        return [];
      }
      
      // Filter out any null/undefined entries
      const validEmployees = response.data.filter(Boolean);
      
      // Show success notification when employees are synced and found
      if (validEmployees.length > 0) {
        toast({
          title: 'Employees loaded',
          description: `Successfully loaded ${validEmployees.length} employees`,
        });
      }
      
      return validEmployees;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    employees,
    isLoading,
    error,
    refetch,
    isRefetching,
    isFetched
  };
}
