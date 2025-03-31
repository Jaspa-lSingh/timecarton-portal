
import React from 'react';
import { User } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EmployeeForm from '@/components/employees/EmployeeForm';

interface EditEmployeeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: User;
  onSubmit: (values: Partial<User>) => void;
  isSubmitting: boolean;
  isUploading: boolean;
}

const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  isOpen,
  onOpenChange,
  employee,
  onSubmit,
  isSubmitting,
  isUploading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update the employee information below.
          </DialogDescription>
        </DialogHeader>
        
        <EmployeeForm
          employee={employee}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          isUploading={isUploading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeDialog;
