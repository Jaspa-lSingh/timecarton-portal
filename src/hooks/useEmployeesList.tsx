
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
      
      if (!response.data) {
        console.warn('No data returned from query function');
        return [];
      }
      
      // Show success notification when employees are synced and found
      if (response.data.length > 0) {
        toast({
          title: 'Employees loaded',
          description: `Successfully loaded ${response.data.length} employees`,
        });
      }
      
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await employeeService.updateEmployee(id, data);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      if (photoFile && data?.id) {
        uploadPhotoMutation.mutate({ id: data.id, file: photoFile });
      } else {
        toast({ title: 'Success', description: 'Employee updated successfully' });
        resetForm();
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const response = await employeeService.uploadProfilePhoto(id, file);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: 'Success', description: 'Profile photo updated successfully' });
      resetForm();
    },
    onError: (error: Error) => {
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
    if (isEditMode && currentEmployee.id) {
      updateMutation.mutate({
        id: currentEmployee.id,
        data: values,
      });
    }
  };

  const handleEdit = (employee: User) => {
    setCurrentEmployee(employee);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      console.log(`Confirming delete for employee ID: ${employeeToDelete}`);
      deleteMutation.mutate(employeeToDelete);
      setDeleteDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setEmployeeToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleRefresh = () => {
    setRefreshAttempts(prev => prev + 1);
    refetch();
    
    toast({
      title: 'Refreshing employees',
      description: 'Checking for new or updated employees...',
    });
  };

  const filteredEmployees = employees.filter((employee) => {
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
