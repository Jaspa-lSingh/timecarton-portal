
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import EmployeeTable from '@/components/employees/EmployeeTable';
import EmployeeSearch from '@/components/employees/EmployeeSearch';
import EmployeeHeader from '@/components/employees/EmployeeHeader';
import DeleteEmployeeDialog from '@/components/employees/DeleteEmployeeDialog';
import EmptyEmployeeState from '@/components/employees/EmptyEmployeeState';
import ErrorState from '@/components/employees/ErrorState';
import { useEmployeesList } from '@/hooks/useEmployeesList';

const EmployeesPage: React.FC = () => {
  const {
    employees,
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
  } = useEmployeesList();

  if (error) {
    return (
      <AdminLayout>
        <ErrorState 
          error={error}
          handleRefresh={handleRefresh}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <EmployeeHeader 
          handleRefresh={handleRefresh}
          isRefetching={isRefetching}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          isEditMode={isEditMode}
          currentEmployee={currentEmployee}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isSubmitting={updateMutation.isPending}
          isUploading={uploadPhotoMutation.isPending}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

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
                employees={employees}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            
            {employees.length === 0 && !isLoading && !isRefetching && (
              <EmptyEmployeeState 
                isFetched={isFetched} 
                handleRefresh={handleRefresh} 
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <DeleteEmployeeDialog 
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={deleteMutation.isPending}
      />
    </AdminLayout>
  );
};

export default EmployeesPage;
