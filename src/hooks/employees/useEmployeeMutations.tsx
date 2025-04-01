
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

/**
 * Hook for employee mutations (update, delete, upload photo)
 */
export function useEmployeeMutations(resetForm: () => void, setRefreshAttempts: (cb: (prev: number) => number) => void) {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

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
    onSuccess: (data, variables, context) => {
      console.log(`Update mutation successful for ID: ${data?.id}`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.setQueryData(['employee', data?.id], data);
      
      const { photoFile } = variables as unknown as { photoFile?: File };
      
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
      
      // Super admin check to prevent deletion
      if (id === '875626') {
        console.error(`Cannot delete super admin account (ID: ${id})`);
        throw new Error('Cannot delete super admin account');
      }
      
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
      
      // Important: Invalidate and remove queries related to this employee
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.removeQueries({ queryKey: ['employee', deletedId] });
      
      // Force a refetch to update the UI
      setRefreshAttempts(prev => prev + 1);
      
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
      
      // Reset state
      setEmployeeToDelete(null);
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      console.error('Delete mutation error:', error);
      toast({
        title: 'Error deleting employee',
        description: error.message,
        variant: 'destructive',
      });
      // Still need to reset state on error
      setEmployeeToDelete(null);
      setDeleteDialogOpen(false);
    },
  });
  
  const handleDelete = (id: string) => {
    console.log(`Preparing to delete employee ID: ${id}`);
    
    if (!id) {
      console.error('Cannot delete: no employee ID provided');
      toast({
        title: 'Error',
        description: 'Cannot delete: no employee ID provided',
        variant: 'destructive',
      });
      return;
    }
    
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      console.log(`Confirming delete for employee ID: ${employeeToDelete}`);
      deleteMutation.mutate(employeeToDelete);
    } else {
      console.warn('Cannot delete: no employee ID selected');
      toast({
        title: 'Error',
        description: 'Cannot delete: no employee selected',
        variant: 'destructive',
      });
      setDeleteDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    console.log('Delete operation canceled');
    setEmployeeToDelete(null);
    setDeleteDialogOpen(false);
  };

  return {
    updateMutation,
    uploadPhotoMutation,
    deleteMutation,
    deleteDialogOpen,
    setDeleteDialogOpen,
    employeeToDelete,
    setEmployeeToDelete,
    handleDelete,
    confirmDelete,
    cancelDelete
  };
}
