
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisterForm from '@/components/RegisterForm';
import EmployeeForm from './EmployeeForm';
import { User } from '@/types';

interface EmployeeActionsProps {
  isDialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  isEditMode: boolean;
  currentEmployee: Partial<User>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isUploading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const EmployeeActions: React.FC<EmployeeActionsProps> = ({
  isDialogOpen,
  setDialogOpen,
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
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2"
          onClick={() => setActiveTab("new")}
        >
          <UserPlus size={18} />
          <span>Add Employee</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the employee information below.'
              : 'Fill in the employee details to add them to your organization.'}
          </DialogDescription>
        </DialogHeader>

        {isEditMode ? (
          <EmployeeForm
            employee={currentEmployee}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            isUploading={isUploading}
          />
        ) : (
          <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="new">New Employee</TabsTrigger>
            </TabsList>
            <TabsContent value="new">
              <RegisterForm adminCreated={true} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeActions;
