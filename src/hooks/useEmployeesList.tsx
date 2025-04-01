
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useEmployeesList() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEmployee, setCurrentEmployee] = useState<Partial<User>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("new");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

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

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      console.log(`Starting update mutation for employee ID: ${id}`, data);
      const response = await employeeService.updateEmployee(id, data);
      console.log(`Update response:`, response);
      
      if (response.error) {
        console.error(`Error in update mutation: ${response.error}`);
        throw new Error(response.error);
      }
      
      if (!response.data) {
        console.error('Update mutation returned no data');
        throw new Error('Failed to update employee - no data returned');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      console.log(`Update mutation successful for ID: ${data?.id}`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.setQueryData(['employee', data?.id], data);
      
      if (photoFile && data?.id) {
        uploadPhotoMutation.mutate({ id: data.id, file: photoFile });
      } else {
        toast({ 
          title: 'Success', 
          description: 'Employee updated successfully'
        });
        resetForm();
        setRefreshAttempts(prev => prev + 1); // Force a refetch
      }
    },
    onError: (error: Error) => {
      console.error('Update mutation error:', error);
      toast({
        title: 'Error updating employee',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      console.log(`Starting photo upload mutation for employee ID: ${id}`);
      const response = await employeeService.uploadProfilePhoto(id, file);
      console.log(`Photo upload response:`, response);
      
      if (response.error) {
        console.error(`Error in photo upload mutation: ${response.error}`);
        throw new Error(response.error);
      }
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log(`Photo upload mutation successful for ID: ${variables.id}`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      toast({ 
        title: 'Success', 
        description: 'Profile photo updated successfully'
      });
      resetForm();
      setRefreshAttempts(prev => prev + 1); // Force a refetch
    },
    onError: (error: Error) => {
      console.error('Photo upload mutation error:', error);
      toast({
        title: 'Error uploading photo',
        description: error.message,
        variant: 'destructive',
      });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log(`Starting delete mutation for employee ID: ${id}`);
      const response = await employeeService.deleteEmployee(id);
      console.log(`Delete response:`, response);
      
      if (response.error) {
        console.error(`Error in delete mutation: ${response.error}`);
        throw new Error(response.error);
      }
      
      return id;
    },
    onSuccess: (deletedId) => {
      console.log(`Delete mutation successful for ID: ${deletedId}`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.removeQueries({ queryKey: ['employee', deletedId] });
      setRefreshAttempts(prev => prev + 1); // Force a refetch
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
      setEmployeeToDelete(null);
    },
    onError: (error: Error) => {
      console.error('Delete mutation error:', error);
      toast({
        title: 'Error deleting employee',
        description: error.message,
        variant: 'destructive',
      });
      setEmployeeToDelete(null);
    },
  });

  const resetForm = () => {
    setCurrentEmployee({});
    setIsEditMode(false);
    setOpenDialog(false);
    setPhotoFile(null);
  };

  const handleSubmit = (values: Partial<User>) => {
    console.log('Handle submit called with values:', values);
    
    if (isEditMode && currentEmployee.id) {
      console.log(`Submitting update for employee ID: ${currentEmployee.id}`);
      updateMutation.mutate({
        id: currentEmployee.id,
        data: values,
      });
    } else {
      console.warn('Cannot update: no employee ID or not in edit mode');
      toast({
        title: 'Error',
        description: 'Cannot update employee: missing ID or not in edit mode',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (employee: User) => {
    console.log('Editing employee:', employee);
    setCurrentEmployee(employee);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    console.log(`Preparing to delete employee ID: ${id}`);
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      console.log(`Confirming delete for employee ID: ${employeeToDelete}`);
      deleteMutation.mutate(employeeToDelete);
      setDeleteDialogOpen(false);
    } else {
      console.warn('Cannot delete: no employee ID selected');
    }
  };

  const cancelDelete = () => {
    console.log('Delete operation canceled');
    setEmployeeToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    setRefreshAttempts(prev => prev + 1);
    refetch();
    
    toast({
      title: 'Refreshing employees',
      description: 'Checking for new or updated employees...',
    });
  };

  // Apply search filter
  const filteredEmployees = Array.isArray(employees) ? employees.filter((employee) => {
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
  }) : [];

  return {
    employees: filteredEmployees,
    isLoading,
    error,
    isRefetching,
    isFetched,
    openDialog,
    setOpenDialog,
    isEditMode,
    searchQuery,
    setSearchQuery,
    currentEmployee,
    photoFile,
    setPhotoFile,
    activeTab,
    setActiveTab,
    deleteDialogOpen,
    setDeleteDialogOpen,
    employeeToDelete,
    updateMutation,
    uploadPhotoMutation,
    deleteMutation,
    handleSubmit,
    handleEdit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleRefresh,
    resetForm
  };
}
