
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2, Database, ServerCrash } from 'lucide-react';
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
  
  // Add a state to track manual refresh attempts
  const [refreshAttempts, setRefreshAttempts] = useState(0);

  useEffect(() => {
    console.log('EmployeesPage mounted, querying employees');
  }, []);

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
    // Increment refresh attempts to force a refetch with the updated query key
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

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-10">
            <div className="flex flex-col items-center justify-center text-red-500 space-y-2">
              <AlertCircle className="h-10 w-10" />
              <h2 className="text-xl font-bold mb-2">Error loading employees</h2>
              <p className="mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mt-4 max-w-md mx-auto">
              <h3 className="font-medium text-amber-700 mb-2">Troubleshooting steps:</h3>
              <ol className="text-sm text-amber-600 list-decimal pl-5 space-y-1 text-left">
                <li>Check that your Supabase database has the users table properly set up</li>
                <li>Verify that Row Level Security (RLS) policies allow you to view all users</li>
                <li>Confirm you're properly authenticated with admin privileges</li>
              </ol>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="mt-6">
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
              isSubmitting={updateMutation?.isPending}
              isUploading={uploadPhotoMutation?.isPending}
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
            
            {employees.length === 0 && !isLoading && !isRefetching && (
              <div className="text-center py-10">
                <p className="mb-2 text-lg text-gray-500">No employees found</p>
                <p className="text-sm mb-6 text-gray-400">Try adding employees using the "Add Employee" button above</p>
                
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-md mx-auto max-w-lg">
                  <h3 className="font-medium text-blue-700 mb-4 text-lg flex items-center">
                    <Database className="mr-2 h-5 w-5" />
                    Synchronization Status
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-3 border-b border-blue-100">
                      <div className={`mt-1 ${isFetched ? 'text-green-500' : 'text-amber-500'}`}>
                        {isFetched ? <CheckCircle2 className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-blue-800">Data Fetch Attempt</h4>
                        <p className="text-sm text-blue-600">
                          {isFetched 
                            ? "Data fetch completed. No employees were found." 
                            : "Data fetch in progress..."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border border-blue-100">
                      <h4 className="font-medium text-blue-800 mb-2">Debugging Information:</h4>
                      <ul className="text-sm text-blue-600 list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-medium">Authentication:</span> You are logged in as an admin user
                        </li>
                        <li>
                          <span className="font-medium">Database Connection:</span> Connected to Supabase
                        </li>
                        <li>
                          <span className="font-medium">User Synchronization:</span> Auth users will be synced to the users table on refresh
                        </li>
                        <li>
                          <span className="font-medium">Row Level Security:</span> Ensure your RLS policies allow admin users to view all employees
                        </li>
                      </ul>
                    </div>
                    
                    <Button onClick={handleRefresh} variant="default" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" /> 
                      Sync and Refresh Employees
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EmployeesPage;
