
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import EmployeeHeader from '@/components/employees/detail/EmployeeHeader';
import EmployeeProfileCard from '@/components/employees/detail/EmployeeProfileCard';
import EmployeeDetailTabs from '@/components/employees/detail/EmployeeDetailTabs';
import EditEmployeeDialog from '@/components/employees/detail/EditEmployeeDialog';
import { Button } from '@/components/ui/button';

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const {
    employee,
    isLoading,
    error,
    handleSubmit,
    handleDelete,
    isUpdating,
    isUploading,
  } = useEmployeeData(id);

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
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            Back to Employees
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <EmployeeHeader 
          onEdit={() => setIsEditDialogOpen(true)} 
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EmployeeProfileCard employee={employee} />
          <EmployeeDetailTabs employee={employee} />
        </div>

        {/* Edit Employee Dialog */}
        <EditEmployeeDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          employee={employee}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          isUploading={isUploading}
        />
      </div>
    </AdminLayout>
  );
};

export default EmployeeDetail;
