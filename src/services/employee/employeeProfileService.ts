
import { ApiResponse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { isAuthenticated } from '@/lib/supabase';

export const employeeProfileService = {
  // Upload profile photo
  uploadProfilePhoto: async (userId: string, file: File): Promise<ApiResponse<string>> => {
    console.log(`Starting upload process for user ID: ${userId}`);
    
    try {
      // Check authentication
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        console.error('Not authenticated for photo upload');
        return { error: 'Not authenticated' };
      }
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log(`Uploading file to path: ${filePath}`);
      
      // Create the bucket if it doesn't exist (this is auto-handled by Supabase)
      
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
      
      console.log('File uploaded successfully, getting public URL');

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);
        
      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error('Failed to get public URL for uploaded file');
        return { error: 'Failed to get public URL for uploaded file' };
      }
      
      console.log('Got public URL:', publicUrlData.publicUrl);

      // Update the user's avatar_url with the new photo URL
      console.log(`Updating avatar URL for user ${userId}`);
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user avatar URL:', updateError);
        return { error: updateError.message };
      }
      
      console.log('Profile photo upload complete');
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
