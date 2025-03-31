
import { useState, useEffect } from 'react';
import { authService, employeeService } from '@/services';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useProfileData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
  });

  useEffect(() => {
    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Update form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        position: user.position || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const result = await authService.updateProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });
      
      if (result.error) {
        toast({
          title: 'Update Failed',
          description: result.error,
          variant: 'destructive'
        });
      } else {
        // Update local user state with the changes
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber
          };
        });
        
        // Upload photo if selected
        if (photoFile) {
          await handlePhotoUpload();
        }
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.'
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!user || !photoFile) return;
    
    setIsUploadingPhoto(true);
    try {
      const result = await employeeService.uploadProfilePhoto(user.id, photoFile);
      
      if (result.error) {
        toast({
          title: 'Photo Upload Failed',
          description: result.error,
          variant: 'destructive'
        });
      } else {
        // Update local user state with new avatar URL
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            avatar: result.data
          };
        });
        
        toast({
          title: 'Photo Updated',
          description: 'Your profile photo has been updated successfully.'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while uploading the photo',
        variant: 'destructive'
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        position: user.position || '',
      });
    }
    setPhotoFile(null);
    setIsEditing(false);
  };

  return {
    user,
    formData,
    isEditing,
    isLoading,
    isUploadingPhoto,
    photoFile,
    setIsEditing,
    setPhotoFile,
    handleInputChange,
    handleSave,
    handleCancel
  };
};
