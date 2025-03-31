
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { User } from '@/types';

interface PhotoUploadProps {
  employee: Partial<User>;
  photoFile: File | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  employee,
  photoFile,
  onPhotoChange,
}) => {
  return (
    <div>
      <FormLabel>Profile Photo</FormLabel>
      <div className="flex items-center space-x-4 mt-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={photoFile ? URL.createObjectURL(photoFile) : employee.avatar} />
          <AvatarFallback>
            {employee.firstName?.[0]}{employee.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum file size: 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
