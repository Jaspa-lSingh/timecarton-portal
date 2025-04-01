
import { useState } from 'react';
import { User } from '@/types';

/**
 * Hook for managing employee form state
 */
export function useEmployeeForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Partial<User>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("new");
  
  const resetForm = () => {
    setCurrentEmployee({});
    setIsEditMode(false);
    setOpenDialog(false);
    setPhotoFile(null);
  };
  
  const handleEdit = (employee: User) => {
    console.log('Editing employee:', employee);
    setCurrentEmployee(employee);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  return {
    openDialog,
    setOpenDialog,
    isEditMode,
    setIsEditMode,
    currentEmployee,
    setCurrentEmployee,
    photoFile,
    setPhotoFile,
    activeTab,
    setActiveTab,
    resetForm,
    handleEdit
  };
}
