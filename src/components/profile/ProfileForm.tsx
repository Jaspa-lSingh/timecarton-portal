
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProfilePhotoUpload from '@/components/forms/ProfilePhotoUpload';
import { User } from '@/types';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
}

interface ProfileFormProps {
  user: User | null;
  formData: ProfileFormData;
  isEditing: boolean;
  isLoading: boolean;
  isUploadingPhoto: boolean;
  photoFile: File | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoFileChange: (file: File | null) => void;
  onSave: () => void;
  onCancel: () => void;
  onEditClick: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  formData,
  isEditing,
  isLoading,
  isUploadingPhoto,
  photoFile,
  onInputChange,
  onPhotoFileChange,
  onSave,
  onCancel,
  onEditClick,
}) => {
  if (!user) return null;
  
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Profile' : 'Profile Details'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update your personal information'
            : 'View your personal information'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing && (
          <ProfilePhotoUpload 
            onFileSelected={onPhotoFileChange} 
            currentPhotoUrl={user.avatar}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={onInputChange}
              readOnly={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={onInputChange}
              readOnly={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            readOnly
            className="bg-gray-50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onInputChange}
            readOnly={!isEditing}
            className={!isEditing ? 'bg-gray-50' : ''}
            placeholder="Enter your phone number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            readOnly
            className="bg-gray-50"
          />
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Account Information</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <span className="text-sm text-gray-500">Role</span>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Hourly Rate</span>
              <p className="font-medium">
                {user.hourlyRate ? `$${user.hourlyRate.toFixed(2)}` : 'Not set'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Contact your administrator to update these details.</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isLoading || isUploadingPhoto}>
              {isLoading || isUploadingPhoto ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onEditClick}>
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
