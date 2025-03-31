import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';
import { Loader2, RefreshCw } from 'lucide-react';
import EmployeeTable from '@/components/employees/EmployeeTable';
import EmployeeSearch from '@/components/employees/EmployeeSearch';
import EmployeeActions from '@/components/employees/EmployeeActions';
import { Button } from '@/components/ui/button';

const EmployeesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEmployee, setCurrentEmployee] = useState<Partial<User>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    console.log('EmployeesPage mounted, querying employees');
  }, []);

  const {
    data: employees = [],
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      console.log('Executing employee query function');
      const response = await employeeService.getEmployees();
      console.log('Employee query response:', response);
      
      if (response.error) {
        console.error('Error in query function:', response.error);
        throw new Error(response.error);
      }
      
      if (!response.data) {
        console.warn('No data returned from query function');
        return [];
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
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    refetch();
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

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-10 text-red-500">
            <h2 className="text-xl font-bold mb-2">Error loading employees</h2>
            <p className="mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-500">Manage your organization's employees</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={isRefetching}
              className="mr-2"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <EmployeeActions 
              isDialogOpen={openDialog}
              setDialogOpen={setOpenDialog}
              isEditMode={isEditMode}
              currentEmployee={currentEmployee}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              isSubmitting={updateMutation.isPending}
              isUploading={uploadPhotoMutation.isPending}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-6">
              <EmployeeSearch 
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {isLoading || isRefetching ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <EmployeeTable 
                employees={filteredEmployees}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            
            {employees.length === 0 && !isLoading && (
              <div className="text-center py-10 text-gray-500">
                <p className="mb-2">No employees found</p>
                <p className="text-sm">Try adding employees using the "Add Employee" button above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EmployeesPage;
