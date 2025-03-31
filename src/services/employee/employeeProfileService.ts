
import { ApiResponse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/auth';

export const employeeProfileService = {
  // Upload profile photo
  uploadProfilePhoto: async (userId: string, file: File): Promise<ApiResponse<string>> => {
    if (!(await authService.isAuthenticated())) {
      return { error: 'Not authenticated' };
    }

    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Error uploading profile photo:', error);
        return { error: error.message };
      }

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      // Update the user's avatar_url with the new photo URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user avatar URL:', updateError);
        return { error: updateError.message };
      }

      return { 
        data: publicUrlData.publicUrl,
        message: 'Profile photo uploaded successfully' 
      };
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      return { error: 'Network error when uploading profile photo' };
    }
  }
};
