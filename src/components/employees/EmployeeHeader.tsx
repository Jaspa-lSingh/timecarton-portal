
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import EmployeeActions from './EmployeeActions';
import { User } from '@/types';

interface EmployeeHeaderProps {
  handleRefresh: () => void;
  isRefetching: boolean;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  isEditMode: boolean;
  currentEmployee: Partial<User>;
  onSubmit: (values: Partial<User>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isUploading: boolean;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  handleRefresh,
  isRefetching,
  openDialog,
  setOpenDialog,
  isEditMode,
  currentEmployee,
  onSubmit,
  onCancel,
  isSubmitting,
  isUploading,
  activeTab,
  setActiveTab
}) => {
  return (
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
          onSubmit={onSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isUploading={isUploading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
};

export default EmployeeHeader;
