
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProfilePhotoUploadProps {
  onFileSelected: (file: File | null) => void;
  currentPhotoUrl?: string;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ 
  onFileSelected,
  currentPhotoUrl = null
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    
    const file = e.target.files?.[0];
    if (!file) {
      onFileSelected(null);
      setPreviewUrl(null);
      setIsLoading(false);
      return;
    }
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, etc.)',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size exceeds 5MB. Please select a smaller file.',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onFileSelected(file);
    setIsLoading(false);
    
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  };
  
  const handleRemove = () => {
    setPreviewUrl(null);
    onFileSelected(null);
  };
  
  return (
    <div className="space-y-3">
      <Label>Profile Photo</Label>
      
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={previewUrl} alt="Profile preview" />
              <AvatarFallback>PH</AvatarFallback>
            </Avatar>
            <button 
              type="button" 
              className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white"
              onClick={handleRemove}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="h-16 w-16 border rounded-full flex items-center justify-center bg-gray-50">
            <Upload size={24} className="text-gray-400" />
          </div>
        )}
        
        <div>
          <input
            type="file"
            id="profile-photo"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Label htmlFor="profile-photo" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <Button type="button" size="sm" variant="outline" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  previewUrl ? 'Change Photo' : 'Upload Photo'
                )}
              </Button>
              <span className="text-sm text-gray-500">
                Max size: 5MB
              </span>
            </div>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
