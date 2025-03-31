
import React from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile: React.FC = () => {
  const {
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
  } = useProfileData();
  
  return (
    <EmployeeLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <ProfileHeader 
            user={user} 
            isEditing={isEditing}
            onEditClick={() => setIsEditing(true)}
          />
          
          {/* Profile Edit Form */}
          <ProfileForm 
            user={user}
            formData={formData}
            isEditing={isEditing}
            isLoading={isLoading}
            isUploadingPhoto={isUploadingPhoto}
            photoFile={photoFile}
            onInputChange={handleInputChange}
            onPhotoFileChange={setPhotoFile}
            onSave={handleSave}
            onCancel={handleCancel}
            onEditClick={() => setIsEditing(true)}
          />
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default Profile;
