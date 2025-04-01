
import { useState } from 'react';
import { User } from '@/types';
import { 
  useEmployeeQuery, 
  useEmployeeSearch, 
  useEmployeeForm, 
  useEmployeeMutations 
} from './employees';
import { toast } from '@/hooks/use-toast';

/**
 * Main hook for employee list management
 */
export function useEmployeesList() {
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  
  // Get employee query functionality
  const { 
    employees, 
    isLoading,
    error,
    refetch,
    isRefetching,
    isFetched
  } = useEmployeeQuery(refreshAttempts);
  
  // Get employee search functionality
  const {
    searchQuery,
    setSearchQuery,
    filteredEmployees
  } = useEmployeeSearch(employees);
  
  // Get employee form management functionality
  const {
    openDialog,
    setOpenDialog,
    isEditMode,
    setIsEditMode,
    currentEmployee,
    setCurrentEmployee,
    photoFile,
    setPhotoFile,
    activeTab,
    setActiveTab,
    resetForm,
    handleEdit
  } = useEmployeeForm();
  
  // Get employee mutations functionality
  const {
    updateMutation,
    uploadPhotoMutation,
    deleteMutation,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete,
    confirmDelete,
    cancelDelete
  } = useEmployeeMutations(resetForm, setRefreshAttempts);
  
  // Handle form submission
  const handleSubmit = (values: Partial<User>) => {
    console.log('Handle submit called with values:', values);
    
    if (isEditMode && currentEmployee.id) {
      console.log(`Submitting update for employee ID: ${currentEmployee.id}`);
      updateMutation.mutate({
        id: currentEmployee.id,
        data: values,
        photoFile // Pass the photo file as part of the mutation variables
      } as any);
    } else {
      console.warn('Cannot update: no employee ID or not in edit mode');
      toast({
        title: 'Error',
        description: 'Cannot update employee: missing ID or not in edit mode',
        variant: 'destructive',
      });
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    setRefreshAttempts(prev => prev + 1);
    refetch();
    
    toast({
      title: 'Refreshing employees',
      description: 'Checking for new or updated employees...',
    });
  };

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
