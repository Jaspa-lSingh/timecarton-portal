
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
  } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      if (!id) throw new Error('Employee ID is required');
      const response = await employeeService.getEmployeeById(id);
      if (response.error) throw new Error(response.error);
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
      
      // Upload photo if provided
      if (photoFile && data?.id) {
        uploadPhotoMutation.mutate({ id: data.id, file: photoFile });
      } else {
        toast({ title: 'Success', description: 'Employee updated successfully' });
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

  // Upload photo mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const response = await employeeService.uploadProfilePhoto(id, file);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      toast({ title: 'Success', description: 'Profile photo updated successfully' });
    },
    onError: (error: Error) => {
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
      const response = await employeeService.deleteEmployee(id);
      if (response.error) throw new Error(response.error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
      navigate('/admin/employees');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (values: Partial<User>) => {
    if (id) {
      updateMutation.mutate({
        id,
        data: values,
      });
    }
  };

  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this employee?')) {
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
  };
}
