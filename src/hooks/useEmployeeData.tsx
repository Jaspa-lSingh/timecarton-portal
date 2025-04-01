
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useEmployeeData(id: string | undefined) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Fetch employee data
  const {
    data: employee,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      if (!id) throw new Error('Employee ID is required');
      console.log(`Fetching employee with ID: ${id}`);
      const response = await employeeService.getEmployeeById(id);
      if (response.error) {
        console.error(`Error fetching employee: ${response.error}`);
        throw new Error(response.error);
      }
      if (!response.data) {
        console.error('Employee data not found');
        throw new Error('Employee data not found');
      }
      console.log('Employee data retrieved successfully:', response.data);
      return response.data;
    },
    enabled: !!id,
  });

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      console.log('Updating employee with data:', data);
      const response = await employeeService.updateEmployee(id, data);
      
      if (response.error) {
        console.error('Error updating employee:', response.error);
        throw new Error(response.error);
      }
      
      // The response might contain data or just a success message with no data
      return response.data || data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      // Upload photo if provided
      if (photoFile && data?.id) {
        console.log(`Photo file detected, uploading for user: ${data.id}`);
        uploadPhotoMutation.mutate({ id: data.id, file: photoFile });
      } else {
        toast({ title: 'Success', description: 'Employee updated successfully' });
      }
    },
    onError: (error: Error) => {
      console.error('Update mutation error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      console.log(`Starting photo upload for user: ${id}`);
      const response = await employeeService.uploadProfilePhoto(id, file);
      if (response.error) {
        console.error(`Photo upload error: ${response.error}`);
        throw new Error(response.error);
      }
      console.log('Photo upload successful:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: 'Success', description: 'Profile photo updated successfully' });
    },
    onError: (error: Error) => {
      console.error('Photo upload mutation error:', error);
      toast({
        title: 'Error uploading photo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log(`Deleting employee with ID: ${id}`);
      const response = await employeeService.deleteEmployee(id);
      
      if (response.error) {
        console.error(`Error deleting employee: ${response.error}`);
        throw new Error(response.error);
      }
      
      return id;
    },
    onSuccess: () => {
      console.log('Delete mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
      navigate('/admin/employees');
    },
    onError: (error: Error) => {
      console.error('Delete mutation error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (values: Partial<User>) => {
    if (id) {
      console.log(`Submitting update for employee ID: ${id}`);
      updateMutation.mutate({
        id,
        data: values,
      });
    }
  };

  const handleDelete = () => {
    if (id) {
      console.log(`Initiating delete for employee ID: ${id}`);
      deleteMutation.mutate(id);
    }
  };

  return {
    employee,
    isLoading,
    error,
    updateMutation,
    uploadPhotoMutation,
    photoFile,
    setPhotoFile,
    handleSubmit,
    handleDelete,
    isUpdating: updateMutation.isPending,
    isUploading: uploadPhotoMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch
  };
}
