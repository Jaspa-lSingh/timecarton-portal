
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services';
import { toast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types';
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  UserCircle,
} from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
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
      const response = await employeeService.updateEmployee(id, data);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      
      // Upload photo if provided
      if (photoFile && data?.id) {
        uploadPhotoMutation.mutate({ id: data.id, file: photoFile });
      } else {
        toast({ title: 'Success', description: 'Employee updated successfully' });
        setIsEditDialogOpen(false);
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
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error uploading photo',
        description: error.message,
        variant: 'destructive',
      });
      // We still close the dialog since the employee was updated
      setIsEditDialogOpen(false);
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !employee) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-10 text-red-500">
            Error loading employee. Please try again.
          </div>
          <Button 
            onClick={() => navigate('/admin/employees')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Employees
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/employees')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Employees
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit size={16} /> Edit
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                {employee.avatar ? (
                  <img
                    src={employee.avatar}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-brand-100 text-brand-700 text-5xl font-semibold">
                    {employee.firstName[0]}
                    {employee.lastName[0]}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-center">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-gray-500 text-center mb-4">{employee.position || 'No Position'}</p>
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{employee.phoneNumber || 'No phone number'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span>{employee.department || 'No department'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserCircle className="h-4 w-4 text-gray-400" />
                  <span>Employee ID: {employee.employeeId || 'Not assigned'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                  <TabsTrigger value="payroll">Payroll</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <TabsContent value="profile" className="space-y-4">
                <h3 className="font-medium text-lg">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">First Name</h4>
                    <p>{employee.firstName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
                    <p>{employee.lastName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p>{employee.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                    <p>{employee.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="employment" className="space-y-4">
                <h3 className="font-medium text-lg">Employment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Employee ID</h4>
                    <p>{employee.employeeId || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Department</h4>
                    <p>{employee.department || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Position</h4>
                    <p>{employee.position || 'Not assigned'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Role</h4>
                    <p className="capitalize">{employee.role || 'Employee'}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <h3 className="font-medium text-lg">Address Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Street Address</h4>
                    <p>{employee.address?.street || 'Not provided'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">City</h4>
                      <p>{employee.address?.city || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">State</h4>
                      <p>{employee.address?.state || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">ZIP Code</h4>
                      <p>{employee.address?.zipCode || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Country</h4>
                    <p>{employee.address?.country || 'Not provided'}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payroll" className="space-y-4">
                <h3 className="font-medium text-lg">Payroll Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Hourly Rate</h4>
                    <p>
                      {employee.hourlyRate 
                        ? `$${parseFloat(employee.hourlyRate.toString()).toFixed(2)}`
                        : 'Not set'}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update the employee information below.
              </DialogDescription>
            </DialogHeader>
            
            <EmployeeForm
              employee={employee}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={updateMutation.isPending}
              isUploading={uploadPhotoMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default EmployeeDetail;
